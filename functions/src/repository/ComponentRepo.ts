import { parseDbError } from "~utils/dbHelper";
import Component from "~models/Component";
import { getDb } from "~utils/db";
import APIError from "~utils/APIError";
import { parseRow as parseProjectRow } from "./ProjectRepo";
import { parseRow as parseTechnologyRow } from "./TechnologyRepo";
import { parseRow as parseCategoryRow } from "./CategoryRepo";
import { HTTP_BAD_REQUEST } from "~utils/http_code";
import { STATUS_ACTIVE } from "~utils/constants";
import { entityNotFoundError } from "~exceptions/genericErrors";

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
 */
export const fetchComponents = async (projectId: string) => {
  try {
    const projectRef = getDb()
      .collection("projects")
      .doc(projectId);

    const components = await getDb()
      .collection("components")
      .where("project", "==", projectRef)
      .where("status", "==", STATUS_ACTIVE)
      .get();

    const result = await Promise.all(components.docs.map(row => parseRow(row.data())));

    return result;
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

const parseRow = async (row: FirebaseFirestore.DocumentData) => {
  try {
    const category: FirebaseFirestore.DocumentSnapshot = await row.category.get();
    row.category = category.exists ? await parseCategoryRow(category.data()) : null;

    const project: FirebaseFirestore.DocumentSnapshot = await row.project.get();
    row.project = project.exists ? await parseProjectRow(project.data()) : null;

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

    return new Component(row);
  } catch (error) {
    throw error;
  }
};
