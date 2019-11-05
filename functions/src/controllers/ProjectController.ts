import moment from "moment";
import { setRequired } from "../utils/helpers";
import { missingParametersError, invalidDateError } from "../exceptions/genericErrors";
import { uploadFile, deleteFile } from "../utils/fileHelper";
import {
  addProject,
  fetchProject,
  updatedCoverImage,
  fetchAllProjects,
} from "../repository/ProjectRepo";
import ClientController from "../controllers/ClientController";
import { IMulterFileUpload } from "../interfaces/IMulterFileUpload";

const clientController: ClientController = new ClientController();

export default class ProjectController {
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
  public addProject = async (
    name: string,
    clientId: string,
    // files: IMulterFileUpload[],
    startDate?: string,
    endDate?: string,
    cost?: number,
    currency?: string,
  ) => {
    try {
      const isValid = setRequired(name, clientId);
      if (!isValid) throw missingParametersError();

      let startDatePayload: moment.Moment;
      let endDatePayload: moment.Moment;

      if (startDate) {
        startDatePayload = moment(startDate, moment.ISO_8601, true);
        if (!startDatePayload.isValid()) throw invalidDateError("Invalid start date");
      }

      if (endDate) {
        endDatePayload = moment(endDate, moment.ISO_8601, true);
        if (!endDatePayload.isValid()) throw invalidDateError("Invalid end date");
      }

      /* let coverImage: IMulterFileUpload;
      let logo: IMulterFileUpload;
      // check if the necesarry files have been uploaded
      files.forEach(file => {
        if (file.fieldname === "cover") coverImage = file;
        if (file.fieldname === "logo") logo = file;
      });

      if (!coverImage) throw missingParametersError("Missing cover image");
      if (!logo) throw missingParametersError("Missing logo"); */

      // check if client exists before performing any operations
      await clientController.fetchClient(clientId);

      // upload the cover image and logo
      /* const coverImageObject = await uploadFile(coverImage);
      const logoObject = await uploadFile(logo); */

      const response = await addProject(
        name,
        clientId,
        startDate ? startDatePayload.toDate() : undefined,
        endDate ? endDatePayload.toDate() : undefined,
        cost,
        currency,
      );

      /* const storage = admin.storage();
      const bucket = storage.bucket();
      const bucketFile = bucket.file(`${PUBLIC_UPLOAD_PATH}/${uuid()}`);

      await bucketFile.save(coverImage.buffer, {
        contentType: coverImage.mimetype,
        gzip: true,
      }); */
      // const destination = `${PUBLIC_UPLOAD_PATH}/${coverImage.originalName}`;

      /* const [url] = await bucketFile.getSignedUrl({
        action: "read",
        expires: "01-01-2050",
      }); */

      /* const res = ((await bucketFile.makePublic()) as unknown) as IMakePublicResponse;
      const url = `http(s)://storage.googleapis.com/${res.bucket}/${res.object}`;

      // const result = await storage.bucket().upload(destination);
      console.log("TCL: ProjectController -> publicaddProject -> result", url); */

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * adds a cover image to a project
   *
   * @param {string} projectId - id of the project for which the cover image is being added
   * @param {IMulterFileUpload[]} files - files array returned by multer
   */
  public addCoverImage = async (projectId: string, files: IMulterFileUpload[]) => {
    try {
      const isValid = setRequired(projectId);
      if (!isValid) throw missingParametersError();

      let coverImage: IMulterFileUpload;
      // check if the necesarry files have been uploaded
      files.forEach(file => {
        if (file.fieldname === "cover") coverImage = file;
      });

      if (!coverImage) throw missingParametersError("Missing cover image");

      // check if project exists before performing any operations
      const project = await fetchProject(projectId);
      console.log("TCL: ProjectController -> publicaddCoverImage -> project", project);

      // upload the cover image
      const coverImageObject = await uploadFile(coverImage);

      const response = await updatedCoverImage(projectId, coverImageObject);

      // delete the previous coverImage if any
      if (project && project.cover) {
        await deleteFile(project.cover.meta);
      }

      /* const response = await addProject(
        name,
        clientId,
        startDate ? startDatePayload.toDate() : undefined,
        endDate ? endDatePayload.toDate() : undefined,
        cost,
        currency,
      ); */

      /* const storage = admin.storage();
      const bucket = storage.bucket();
      const bucketFile = bucket.file(`${PUBLIC_UPLOAD_PATH}/${uuid()}`);

      await bucketFile.save(coverImage.buffer, {
        contentType: coverImage.mimetype,
        gzip: true,
      }); */
      // const destination = `${PUBLIC_UPLOAD_PATH}/${coverImage.originalName}`;

      /* const [url] = await bucketFile.getSignedUrl({
        action: "read",
        expires: "01-01-2050",
      }); */

      /* const res = ((await bucketFile.makePublic()) as unknown) as IMakePublicResponse;
      const url = `http(s)://storage.googleapis.com/${res.bucket}/${res.object}`;

      // const result = await storage.bucket().upload(destination);
      console.log("TCL: ProjectController -> publicaddProject -> result", url); */

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * delete cover image for a project
   *
   * @param {string} projectId - id of the project for which the cover image is being deleted
   */
  public deleteCoverImage = async (projectId: string) => {
    try {
      const isValid = setRequired(projectId);
      if (!isValid) throw missingParametersError();

      const project = await fetchProject(projectId);

      const response = await updatedCoverImage(projectId);

      // delete the previous coverImage if any
      if (project && project.cover) {
        await deleteFile(project.cover.meta);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * fetch all projects in the system
   */
  public fetchAllProjects = async () => {
    try {
      const projects = await fetchAllProjects();

      return projects;
    } catch (error) {
      throw error;
    }
  };
}
