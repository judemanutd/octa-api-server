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
  // coverImageObject: IMakePublicResponse,
  startDate?: Date,
  endDate?: Date,
  cost?: number,
  currency?: string,
) => {
  try {
    // const id = uuid();

    /* const client = await getDb()
      .collection("clients")
      .doc(clientId)
      .get();

    if (!client.exists) throw entityNotFoundError("Client not found"); */

    const clientRef = getDb()
      .collection("clients")
      .doc(clientId);

    /* const insertObj: any = {
      id,
      name,
      client: clientRef,
      status: STATUS_ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    }; */

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
 * checks if a project exists that is active
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
    // console.log("TCL: fetchProject -> project", project);

    if (!project.exists || (project.exists && project.data().status !== STATUS_ACTIVE))
      throw entityNotFoundError("Project does not exisst");

    return parseRow(project.data());
  } catch (error) {
    throw parseDbError(error);
  }
};

const parseRow = async (row: FirebaseFirestore.DocumentData) => {
  // console.log("TCL: parseRow -> row", row);
  try {
    const client: FirebaseFirestore.DocumentSnapshot = await row.client.get();
    row.client = client.exists ? client.data() : null;

    row.client.createdAt = row.client.createdAt.toDate();
    row.client.updatedAt = row.client.updatedAt.toDate();

    row.createdAt = row.createdAt.toDate();
    row.updatedAt = row.updatedAt.toDate();

    return new Project(row);
    /*     const client: FirebaseFirestore.DocumentSnapshot = await row.client.get();
    row.client = client.exists ? client.data() : null;

    const obj: IProject = {
      id: row.id,
      name: row.name,
      client:
        row.client !== null
          ? {
              id: row.client.id,
              name: row.client.name,
              address: row.client.address,
              createdAt: row.client.createdAt.toDate(),
              updatedAt: row.client.updatedAt.toDate(),
            }
          : null,
      cover: row.cover
        ? {
            link: row.cover.link,
            meta: row.cover.meta,
          }
        : null,
      createdAt: row.createdAt.toDate(),
      updatedAt: row.updatedAt.toDate(),
    };

    return obj; */
  } catch (error) {
    throw error;
  }
};
