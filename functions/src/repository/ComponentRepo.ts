import admin = require("firebase-admin");
import { ICloudStorageUploadResponse } from "~interfaces/ICloudStorageUploadResponse";
import { IGalleryItem } from "~interfaces/IGalleryItem";
import { parseDbError } from "~utils/dbHelper";
import Component from "~models/Component";
import { getDb } from "~utils/db";
import APIError from "~utils/APIError";
import { generatePublicLink } from "~utils/fileHelper";
import { HTTP_BAD_REQUEST } from "~utils/http_code";
import { STATUS_ACTIVE } from "~utils/constants";
import { entityNotFoundError } from "~exceptions/genericErrors";
import { parseRow as parseProjectRow } from "./ProjectRepo";
import { parseRow as parseTechnologyRow } from "./TechnologyRepo";
import { parseRow as parseCategoryRow } from "./CategoryRepo";

/**
 * ADMIN
 *
 * adds a component to a project
 *
 * @param {string} name - name of the component
 * @param {string} projectId - project id to which this component belongs
 * @param {string} categoryId - category id to which this component belongs
 * @param {string[]} technologyIds - array of technology ids that are used in this project
 * @param {string[]} links - array of links for the component
 * @param {string} summary - summary for the component
 * @param {string} description - description for the component
 */
export const addComponent = async (
  name: string,
  projectId: string,
  categoryId: string,
  technologyIds: string[] = [],
  links: string[] = [],
  summary?: string,
  description?: string,
) => {
  try {
    const projectRef = getDb()
      .collection("projects")
      .doc(projectId);

    const categoryRef = getDb()
      .collection("categories")
      .doc(categoryId);

    const technologyRef: FirebaseFirestore.DocumentReference[] = technologyIds.map(technology =>
      getDb()
        .collection("technologies")
        .doc(technology),
    );

    const insertObj = Component.init(
      name,
      projectRef,
      categoryRef,
      technologyRef,
      links,
      summary,
      description,
    );

    await getDb()
      .collection("components")
      .doc(insertObj.id)
      .set(insertObj);
    return {
      id: insertObj.id,
      message: "Successfully Added",
    };
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * update the details of a component
 *
 * @param {string} componentId - component id to which this component belongs
 * @param {string} projectId - project id to which this component belongs
 * @param {string} name - name of the component
 * @param {string} categoryId - category id to which this component belongs
 * @param {string[]} technologyIds - array of technology ids that are used in this project
 * @param {string[]} links - array of links for the component
 * @param {string} summary - summary for the component
 * @param {string} description - description for the component
 */
export const updateComponent = async (
  componentId: string,
  projectId: string,
  name?: string,
  categoryId?: string,
  technologyIds?: string[],
  links?: string[],
  summary?: string,
  description?: string,
) => {
  try {
    let shouldUpdate = false;

    const obj: any = {
      updatedAt: new Date(),
    };

    if (name) {
      shouldUpdate = true;
      obj.name = name;
    }

    if (summary) {
      shouldUpdate = true;
      obj.summary = summary;
    }

    if (description) {
      shouldUpdate = true;
      obj.description = description;
    }

    if (categoryId) {
      shouldUpdate = true;
      obj.category = getDb()
        .collection("categories")
        .doc(categoryId);
    }

    if (technologyIds && technologyIds.length > 0) {
      shouldUpdate = true;
      obj.technology = technologyIds.map(technology =>
        getDb()
          .collection("technologies")
          .doc(technology),
      );
    }

    if (links && links.length > 0) {
      shouldUpdate = true;
      obj.links = links;
    }

    if (!shouldUpdate) {
      throw new APIError("No attributes specified for updation", undefined, HTTP_BAD_REQUEST);
    }

    await getDb()
      .collection("components")
      .doc(componentId)
      .update(obj);
    return {
      id: componentId,
      message: "Successfully Updated",
    };
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * fetch all components for a project
 *
 * @param {string} projectId - project for which all components are being fetched
 * @param {boolean} isPublic - indicates if the data is being fetched for public, will hide sensitive data
 */
export const fetchComponents = async (projectId: string, isPublic: boolean = false) => {
  try {
    const projectRef = getDb()
      .collection("projects")
      .doc(projectId);

    const components = await getDb()
      .collection("components")
      .where("project", "==", projectRef)
      .where("status", "==", STATUS_ACTIVE)
      .get();

    const result = await Promise.all(components.docs.map(row => parseRow(row.data(), isPublic)));

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * ADMIN & PUBLIC
 *
 * fetch all components for display in a select, does not fetch related objects
 *
 */
export const fetchComponentsForSelect = async () => {
  try {
    const components = await getDb()
      .collection("components")
      .where("status", "==", STATUS_ACTIVE)
      .get();

    const result = await Promise.all(
      components.docs.map(row => {
        const item = row.data();

        return {
          id: item.id,
          text: item.name,
        };
      }),
    );

    return result;
  } catch (error) {
    throw error;
  }
};

/**
 * ADMIN
 *
 * fetch all components for the following filter critera
 *
 * @param componentId - array of component ids
 * @param projectId - array of project ids
 * @param technologyId - array of technology ids
 * @param categoryId - array of category ids
 */
export const filterComponents = async (
  componentId?: string[],
  projectId?: string[],
  technologyId?: string[],
  categoryId?: string[],
) => {
  try {
    const result: Component[] = [];

    // fetch all components for the given component ids
    if (componentId && componentId.length > 0) {
      const refs: FirebaseFirestore.DocumentReference[] = [];
      componentId.forEach(item => {
        refs.push(
          getDb()
            .collection("components")
            .doc(item),
        );
      });

      const docsPromise = (await getDb().getAll(...refs)).map(async component =>
        parseRow(component.data()),
      );

      result.push(...(await Promise.all(docsPromise)));
    }

    // fetch all components with the given project ids
    if (projectId && projectId.length > 0) {
      const projectPromises = projectId.map(async item => {
        const projectRef = getDb()
          .collection("projects")
          .doc(item);

        // fetch all components that have the given project id
        const components = await getDb()
          .collection("components")
          .where("project", "==", projectRef)
          .where("status", "==", STATUS_ACTIVE)
          .get();

        return Promise.all(components.docs.map(row => parseRow(row.data())));
      });

      const projectComponents = await Promise.all(projectPromises);
      projectComponents.map(projectComponent => {
        result.push(...projectComponent);
      });
    }

    // filter all components with the given technology
    if (technologyId && technologyId.length > 0) {
      const technologyComponentsPromises = technologyId.map(async item => {
        const components = await getDb()
          .collection("components")
          .where(
            "technology",
            "array-contains",
            getDb()
              .collection("technologies")
              .doc(item),
          )
          .where("status", "==", STATUS_ACTIVE)
          .get();

        return Promise.all(components.docs.map(row => parseRow(row.data())));
      });

      const technologyComponents = await Promise.all(technologyComponentsPromises);
      technologyComponents.map(technologyComponent => {
        result.push(...technologyComponent);
      });
    }

    // filter all components with the given category
    if (categoryId && categoryId.length > 0) {
      const categoryComponentsPromises = categoryId.map(async item => {
        const components = await getDb()
          .collection("components")
          .where(
            "category",
            "==",
            getDb()
              .collection("categories")
              .doc(item),
          )
          .where("status", "==", STATUS_ACTIVE)
          .get();

        return Promise.all(components.docs.map(row => parseRow(row.data())));
      });

      const categoryComponents = await Promise.all(categoryComponentsPromises);
      categoryComponents.map(categoryComponent => {
        result.push(...categoryComponent);
      });
    }

    if (result.length <= 0) return result;

    // filter to only have unique components
    const componentsObj = {};
    result.forEach(component => {
      componentsObj[`${component.id}`] = component;
    });
    const filteredComponents: Component[] = Object.keys(componentsObj).map(key => {
      return componentsObj[key];
    });

    return filteredComponents;
  } catch (error) {
    throw error;
  }
};

/**
 * ADMIN
 *
 * fetch a single component
 *
 * @param {string} componentId - component id to which this component belongs
 */
export const fetchComponent = async (componentId: string) => {
  try {
    const component = await getDb()
      .collection("components")
      .doc(componentId)
      .get();

    if (!component.exists || (component.exists && component.data().status !== STATUS_ACTIVE))
      throw entityNotFoundError("Component does not exist");

    return parseRow(component.data());
  } catch (error) {
    throw error;
  }
};

/**
 * ADMIN
 *
 * adds a cover image to a component
 *
 * @param {string} projectId - id of the project
 * @param {string} componentId - id of the component for which the cover image is being added
 * @param {IMulterFileUpload[]} files - files array returned by multer
 */
export const updatedCoverImage = async (
  projectId: string,
  componentId: string,
  file?: ICloudStorageUploadResponse,
) => {
  try {
    if (file) {
      // add cover image
      const publicLink = generatePublicLink(file);

      await getDb()
        .collection("components")
        .doc(componentId)
        .update({
          cover: {
            link: generatePublicLink(file),
            meta: file,
          },
          updatedAt: new Date(),
        });

      return {
        link: publicLink,
        message: "Successfully uploaded",
      };
    } else {
      // delete cover image
      await getDb()
        .collection("components")
        .doc(projectId)
        .update({
          cover: null,
          updatedAt: new Date(),
        });

      return {
        message: "Successfully deleted",
      };
    }
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * adds an image to the component gallery
 *
 * @param {string} componentId - id of the component
 * @param {string} projectId - id of the project
 * @param {ICloudStorageUploadResponse[]} file - file that was uploaded to cloud storage and need to be added to the project gallery
 * @param {string} name - name for the upload
 * @param {string} description - description for the upload
 */
export const addGalleryImage = async (
  componentId: string,
  projectId: string,
  file: ICloudStorageUploadResponse,
  name?: string,
  description?: string,
) => {
  try {
    const publicLink = generatePublicLink(file);

    await getDb()
      .collection("components")
      .doc(componentId)
      .update({
        gallery: Component.initGalleryItem(file, name, description),
        updatedAt: new Date(),
      });

    return {
      link: publicLink,
      message: "Successfully uploaded",
    };
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * deletes an image from the component gallery
 *
 * @param {string} componentId - id of the component
 * @param {string} projectId - id of the project
 * @param {string} galleryItemId - gallery item that needs to be deleted
 */
export const deleteGalleryImage = async (
  componentId: string,
  projectId: string,
  galleryItem: IGalleryItem,
) => {
  try {
    await getDb()
      .collection("components")
      .doc(componentId)
      .update({
        gallery: admin.firestore.FieldValue.arrayRemove(galleryItem),
        updatedAt: new Date(),
      });

    return {
      message: "Successfully deleted",
    };
  } catch (error) {
    throw parseDbError(error);
  }
};

export const parseRow = async (row: FirebaseFirestore.DocumentData, isPublic: boolean = false) => {
  try {
    const category: FirebaseFirestore.DocumentSnapshot = await row.category.get();
    row.category = category.exists ? await parseCategoryRow(category.data()) : null;

    const project: FirebaseFirestore.DocumentSnapshot = await row.project.get();
    row.project = project.exists ? await parseProjectRow(project.data(), isPublic) : null;

    const technologyPromises = row.technology.map(
      async (technologyRef: FirebaseFirestore.DocumentReference) => {
        const technology: FirebaseFirestore.DocumentSnapshot = await technologyRef.get();
        const techData = technology.exists ? await parseTechnologyRow(technology.data()) : null;
        return techData;
      },
    );
    row.technology = await Promise.all(technologyPromises);

    row.createdAt = row.createdAt.toDate();
    row.updatedAt = row.updatedAt.toDate();

    const component = new Component(row);

    if (isPublic) {
      if (component.cover && component.cover.meta) delete component.cover.meta;
      if (component.logo && component.logo.meta) delete component.logo.meta;

      const gallery = component.gallery.map(({ meta, ...params }) => params);
      component.gallery = gallery;
    }

    return component;
  } catch (error) {
    throw error;
  }
};
