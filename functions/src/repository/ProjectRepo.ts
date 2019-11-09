import { getDb } from "../utils/db";
import { ICloudStorageUploadResponse } from "../interfaces/ICloudStorageUploadResponse";
import { parseDbError } from "../utils/dbHelper";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "../utils/constants";
import { entityNotFoundError } from "../exceptions/genericErrors";
import { generatePublicLink } from "../utils/fileHelper";
// import { IProject } from "../interfaces/IProject";
import Project from "../models/Project";

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
      throw entityNotFoundError("Project does not exisst");

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
      throw entityNotFoundError("Project does not exisst");

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
      throw entityNotFoundError("Project does not exisst");

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

const parseRow = async (row: FirebaseFirestore.DocumentData) => {
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
