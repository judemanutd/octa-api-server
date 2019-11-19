import admin = require("firebase-admin");
import { getDb } from "~utils/db";
import { ICloudStorageUploadResponse } from "~interfaces/ICloudStorageUploadResponse";
import { IGalleryItem } from "~interfaces/IGalleryItem";
import Project from "~models/Project";
import { parseDbError } from "~utils/dbHelper";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "~utils/constants";
import { entityNotFoundError } from "~exceptions/genericErrors";
import { generatePublicLink } from "~utils/fileHelper";

/**
 * ADMIN
 *
 * adds a project with the most basic required information so an object can be created in the db for further editing
 *
 * @param {string} name - name of the project
 * @param {string} clientId - client id to whom the probject belongs
 * @param {string} startDate - start date of the project
 * @param {string} endDate - end date of the project
 * @param {number} cost - project cost
 * @param {string} currency - currecy
 */
export const addProject = async (
  name: string,
  clientId: string,
  startDate?: Date,
  endDate?: Date,
  cost?: number,
  currency?: string,
) => {
  try {
    const clientRef = getDb()
      .collection("clients")
      .doc(clientId);

    const insertObj = Project.init(name, clientRef);

    if (startDate) insertObj.startDate = startDate;
    if (endDate) insertObj.endDate = endDate;
    if (cost) insertObj.cost = cost;
    if (currency) insertObj.currency = currency;

    await getDb()
      .collection("projects")
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
 * update a projects details
 *
 * @param {string} projectId - id of the project that is being updated
 * @param {string} name - name of the project
 * @param {string} clientId - client id to whom the probject belongs
 * @param {string} startDate - start date of the project
 * @param {string} endDate - end date of the project
 * @param {number} cost - project cost
 * @param {string} currency - currecy
 */
export const updateProject = async (
  projectId: string,
  name?: string,
  clientId?: string,
  startDate?: Date,
  endDate?: Date,
  cost?: number,
  currency?: string,
) => {
  try {
    const obj: any = {};

    if (name) obj.name = name;
    if (clientId) {
      obj.client = getDb()
        .collection("clients")
        .doc(clientId);
    }
    if (startDate) obj.startDate = startDate;
    if (endDate) obj.endDate = endDate;
    if (cost) obj.cost = cost;
    if (currency) obj.currency = currency;

    if (Object.keys(obj).length > 0) {
      obj.updatedAt = new Date();

      await getDb()
        .collection("projects")
        .doc(projectId)
        .update(obj);
    }

    return {
      id: projectId,
      message: "Successfully Updated",
    };
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * update the cover image for a project, handles both adding and deleting an image
 *
 * @param {string} projectId - id of the project
 * @param {ICloudStorageUploadResponse} file - optional upload response from google cloud storage
 */
export const updatedCoverImage = async (projectId: string, file?: ICloudStorageUploadResponse) => {
  try {
    const project = await getDb()
      .collection("projects")
      .doc(projectId)
      .get();

    if (!project.exists || (project.exists && project.data().status !== STATUS_ACTIVE))
      throw entityNotFoundError("Project does not exist");

    if (file) {
      // add cover image
      const publicLink = generatePublicLink(file);

      await getDb()
        .collection("projects")
        .doc(projectId)
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
        .collection("projects")
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
 * adds an image to the project gallery
 *
 * @param {string} projectId - id of the project
 * @param {ICloudStorageUploadResponse[]} file - file that was uploaded to cloud storage and need to be added to the project gallery
 * @param {string} name - name for the upload
 * @param {string} description - description for the upload
 */
export const addGalleryImage = async (
  projectId: string,
  file: ICloudStorageUploadResponse,
  name?: string,
  description?: string,
) => {
  try {
    const publicLink = generatePublicLink(file);

    await getDb()
      .collection("projects")
      .doc(projectId)
      .update({
        gallery: Project.initGalleryItem(file, name, description),
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
 * deletes an image from the project gallery
 *
 * @param {string} projectId - id of the project
 * @param {string} galleryItemId - gallery item that needs to be deleted
 */
export const deleteGalleryImage = async (projectId: string, galleryItem: IGalleryItem) => {
  try {
    await getDb()
      .collection("projects")
      .doc(projectId)
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

/**
 * ADMIN
 *
 * update the logo for a project, handles both adding and deleting an image
 *
 * @param {string} projectId - id of the project
 * @param {ICloudStorageUploadResponse} file - optional upload response from google cloud storage
 */
export const updatedLogoImage = async (projectId: string, file?: ICloudStorageUploadResponse) => {
  try {
    const project = await getDb()
      .collection("projects")
      .doc(projectId)
      .get();

    if (!project.exists || (project.exists && project.data().status !== STATUS_ACTIVE))
      throw entityNotFoundError("Project does not exist");

    if (file) {
      // add logo image
      const publicLink = generatePublicLink(file);

      await getDb()
        .collection("projects")
        .doc(projectId)
        .update({
          logo: {
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
      // delete logo image
      await getDb()
        .collection("projects")
        .doc(projectId)
        .update({
          logo: null,
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
 * fetch all projects in the system
 *
 */
export const fetchAllProjects = async () => {
  try {
    const projects = await getDb()
      .collection("projects")
      .where("status", "==", STATUS_ACTIVE)
      .get();

    const promises = projects.docs.map(project => parseRow(project.data()));

    return await Promise.all(promises);
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * fetch a single project
 *
 * @param {string} projectId - id of the project
 */
export const fetchProject = async (projectId: string) => {
  try {
    const project = await getDb()
      .collection("projects")
      .doc(projectId)
      .get();

    if (!project.exists || (project.exists && project.data().status !== STATUS_ACTIVE))
      throw entityNotFoundError("Project does not exist");

    return parseRow(project.data());
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * archive a single project
 *
 * @param {string} projectId - id of the project
 */
export const archiveProject = async (projectId: string) => {
  try {
    await getDb()
      .collection("projects")
      .doc(projectId)
      .update({
        status: STATUS_INACTIVE,
        updatedAt: new Date(),
      });

    return {
      id: projectId,
      message: "Successfully Archived",
    };
  } catch (error) {
    throw parseDbError(error);
  }
};

export const parseRow = async (row: FirebaseFirestore.DocumentData) => {
  try {
    const client: FirebaseFirestore.DocumentSnapshot = await row.client.get();
    row.client = client.exists ? client.data() : null;

    row.client.createdAt = row.client.createdAt.toDate();
    row.client.updatedAt = row.client.updatedAt.toDate();

    row.createdAt = row.createdAt.toDate();
    row.updatedAt = row.updatedAt.toDate();

    return new Project(row);
  } catch (error) {
    throw error;
  }
};
