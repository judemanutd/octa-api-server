import moment from "moment";
import { setRequired } from "~utils/helpers";
import {
  missingParametersError,
  invalidDateError,
  entityNotFoundError,
} from "~exceptions/genericErrors";
import { uploadFile, deleteFile } from "~utils/fileHelper";
import {
  addProject,
  fetchProject,
  updatedCoverImage,
  fetchAllProjects,
  updatedLogoImage,
  archiveProject,
  updateProject,
  addGalleryImage,
  deleteGalleryImage,
} from "~repository/ProjectRepo";
import ClientController from "~controllers/ClientController";
import { IMulterFileUpload } from "~interfaces/IMulterFileUpload";

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

      // check if client exists before performing any operations
      await clientController.fetchClient(clientId);

      const response = await addProject(
        name,
        clientId,
        startDate ? startDatePayload.toDate() : undefined,
        endDate ? endDatePayload.toDate() : undefined,
        cost,
        currency,
      );

      return response;
    } catch (error) {
      throw error;
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
  public updateProject = async (
    projectId: string,
    name?: string,
    clientId?: string,
    startDate?: string,
    endDate?: string,
    cost?: number,
    currency?: string,
  ) => {
    try {
      const isValid = setRequired(projectId);
      if (!isValid) throw missingParametersError("Missing project id");

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

      if (clientId) {
        // check if client exists before performing any operations
        await clientController.fetchClient(clientId);
      }

      const response = await updateProject(
        projectId,
        name,
        clientId,
        startDate ? startDatePayload.toDate() : undefined,
        endDate ? endDatePayload.toDate() : undefined,
        cost,
        currency,
      );

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

      // upload the cover image
      const coverImageObject = await uploadFile(coverImage);

      const response = await updatedCoverImage(projectId, coverImageObject);

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
   * adds a logo to a project
   *
   * @param {string} projectId - id of the project for which the cover image is being added
   * @param {IMulterFileUpload[]} files - files array returned by multer
   */
  public addLogo = async (projectId: string, files: IMulterFileUpload[]) => {
    try {
      const isValid = setRequired(projectId);
      if (!isValid) throw missingParametersError();

      let logoImage: IMulterFileUpload;
      // check if the necesarry files have been uploaded
      files.forEach(file => {
        if (file.fieldname === "logo") logoImage = file;
      });

      if (!logoImage) throw missingParametersError("Missing logo image");

      // check if project exists before performing any operations
      const project = await fetchProject(projectId);

      // upload the logo
      const logoImageObject = await uploadFile(logoImage);

      const response = await updatedLogoImage(projectId, logoImageObject);

      // delete the previous logo if any
      if (project && project.logo) {
        await deleteFile(project.logo.meta);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * delete logo image for a project
   *
   * @param {string} projectId - id of the project for which the logo image is being deleted
   */
  public deleteLogoImage = async (projectId: string) => {
    try {
      const isValid = setRequired(projectId);
      if (!isValid) throw missingParametersError();

      const project = await fetchProject(projectId);

      const response = await updatedLogoImage(projectId);

      // delete the previous logo if any
      if (project && project.logo) {
        await deleteFile(project.logo.meta);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * add an image to the project gallery
   *
   * @param {string} projectId - id of the project for which the cover image is being added
   * @param {IMulterFileUpload} files - files array returned by multer
   * @param {string} name - name for the upload
   * @param {string} description - description for the upload
   */
  public addGalleryImage = async (
    projectId: string,
    files: IMulterFileUpload[],
    name?: string,
    description?: string,
  ) => {
    try {
      const isValid = setRequired(projectId);
      if (!isValid) throw missingParametersError();

      let galleryImage: IMulterFileUpload;
      // check if the necesarry files have been uploaded
      files.forEach(file => {
        if (file.fieldname === "gallery") galleryImage = file;
      });

      if (!galleryImage) throw missingParametersError("Missing gallery image");

      // check if project exists before performing any operations
      const project = await fetchProject(projectId);

      const galleryImageObject = await uploadFile(galleryImage);

      const response = await addGalleryImage(project.id, galleryImageObject, name, description);

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * delete an image from the project gallery
   *
   * @param {string} projectId - id of the project for which the cover image is being added
   * @param {string} galleryImageId - id of the image in the project that needs to be deleted
   */
  public deleteGalleryImage = async (projectId: string, galleryImageId: string) => {
    try {
      const isValid = setRequired(projectId, galleryImageId);
      if (!isValid) throw missingParametersError();

      // check if project exists before performing any operations
      const project = await fetchProject(projectId);

      const galleryItemArr = project.gallery.filter(
        galleryItem => galleryItem.id === galleryImageId,
      );

      if (galleryItemArr.length <= 0) {
        // unable to find item
        throw entityNotFoundError("Unable to find gallery item");
      }

      const galleryItemToDelete = galleryItemArr[0];

      const response = await deleteGalleryImage(projectId, galleryItemToDelete);

      await deleteFile(galleryItemToDelete.meta);

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * fetch a single project in the system
   */
  public fetchProject = async (projectId: string) => {
    try {
      const isValid = setRequired(projectId);
      if (!isValid) throw missingParametersError();

      const project = await fetchProject(projectId);

      return project;
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

  /**
   * ADMIN
   *
   * archive a project in the system
   */
  public archiveProject = async (projectId: string) => {
    try {
      const isValid = setRequired(projectId);
      if (!isValid) throw missingParametersError();

      // check if project exists before performing any operations
      await fetchProject(projectId);

      // delete the logo image
      await updatedLogoImage(projectId);
      // delete cover image
      await updatedCoverImage(projectId);

      // delete project from the db
      const response = await archiveProject(projectId);

      return response;
    } catch (error) {
      throw error;
    }
  };
}
