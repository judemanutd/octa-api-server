import { string, array } from "yup";
import componentLinkSchema from "~schemas/ComponentLinkSchema";
import { setRequired } from "~utils/helpers";
import { missingParametersError } from "~exceptions/genericErrors";
import ProjectController from "~controllers/ProjectController";
import CategoryController from "~controllers/CategoryController";
import {
  addComponent,
  updateComponent,
  fetchComponent,
  fetchComponents,
  updatedCoverImage,
} from "~repository/ComponentRepo";
import { IMulterFileUpload } from "~interfaces/IMulterFileUpload";
import { uploadFile, deleteFile } from "~utils/fileHelper";

const projectController: ProjectController = new ProjectController();
const categoryController: CategoryController = new CategoryController();

export default class ComponentController {
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
  public addComponent = async (
    name: string,
    projectId: string,
    categoryId: string,
    technologyIds: string[] = [],
    links: string[] = [],
    summary?: string,
    description?: string,
  ) => {
    try {
      const isValid = setRequired(name, projectId, categoryId);
      if (!isValid) throw missingParametersError();

      let parsedLinks;
      let parsedTechnologyIds;

      if (links.length > 0) {
        // verify links is valid
        try {
          parsedLinks = componentLinkSchema()
            .default(() => [])
            .validateSync(links, {
              abortEarly: true,
            });
        } catch (error) {
          throw error;
        }
      }

      if (technologyIds.length > 0) {
        try {
          parsedTechnologyIds = array(string())
            .default(() => [])
            .validateSync(technologyIds, {
              abortEarly: true,
            });
        } catch (error) {
          throw error;
        }
      }

      const project = await projectController.fetchProject(projectId);
      const category = await categoryController.fetchCategory(categoryId);

      // TODO: check if technologies are valid

      const response = await addComponent(
        name,
        project.id,
        category.id,
        parsedTechnologyIds,
        parsedLinks,
        summary,
        description,
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * updates a component for a project
   *
   * @param {string} componentId - component id that is being updated
   * @param {string} projectId - project id to which this component belongs
   * @param {string} name - name of the component
   * @param {string} categoryId - category id to which this component belongs
   * @param {string[]} technologyIds - array of technology ids that are used in this project
   * @param {string[]} links - array of links for the component
   * @param {string} summary - summary for the component
   * @param {string} description - description for the component
   */
  public updateComponent = async (
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
      const isValid = setRequired(projectId, componentId);
      if (!isValid) throw missingParametersError();

      let parsedLinks;
      let parsedTechnologyIds;
      let category;

      if (links && links.length > 0) {
        // verify links is valid
        try {
          parsedLinks = componentLinkSchema()
            .default(() => [])
            .validateSync(links, {
              abortEarly: true,
            });
        } catch (error) {
          throw error;
        }
      }

      if (technologyIds && technologyIds.length > 0) {
        try {
          parsedTechnologyIds = array(string())
            .default(() => [])
            .validateSync(technologyIds, {
              abortEarly: true,
            });
        } catch (error) {
          throw error;
        }
      }

      const project = await projectController.fetchProject(projectId);
      if (categoryId) category = await categoryController.fetchCategory(categoryId);
      const component = await fetchComponent(componentId);

      // TODO: check if technologies are valid

      const response = await updateComponent(
        component.id,
        project.id,
        name,
        category ? category.id : null,
        parsedTechnologyIds,
        parsedLinks,
        summary,
        description,
      );

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * fetch all components for a given project
   *
   * @param {string} projectId - id of the project for which all components are fetched
   */
  public fetchComponents = async (projectId: string) => {
    try {
      const isValid = setRequired(projectId);
      if (!isValid) throw missingParametersError();

      const project = await projectController.fetchProject(projectId);

      const component = await fetchComponents(project.id);

      return component;
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
  public fetchComponent = async (componentId: string) => {
    try {
      const isValid = setRequired(componentId);
      if (!isValid) throw missingParametersError();

      const component = await fetchComponent(componentId);

      return component;
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
  public addCoverImage = async (
    projectId: string,
    componentId: string,
    files: IMulterFileUpload[],
  ) => {
    try {
      const isValid = setRequired(projectId, componentId);
      if (!isValid) throw missingParametersError();

      let coverImage: IMulterFileUpload;
      // check if the necesarry files have been uploaded
      files.forEach(file => {
        if (file.fieldname === "cover") coverImage = file;
      });

      if (!coverImage) throw missingParametersError("Missing cover image");

      const component = await fetchComponent(componentId);

      // upload the cover image
      const coverImageObject = await uploadFile(coverImage);

      const response = await updatedCoverImage(
        component.project.id,
        component.id,
        coverImageObject,
      );

      // delete the previous coverImage if any
      if (component && component.cover) {
        await deleteFile(component.cover.meta);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * delete cover image for a component
   *
   * @param {string} projectId - id of the project
   * @param {string} componentId - id of the component for which the cover image is being added
   */
  public deleteCoverImage = async (projectId: string, componentId: string) => {
    try {
      const isValid = setRequired(projectId, componentId);
      if (!isValid) throw missingParametersError();

      const component = await fetchComponent(componentId);

      const response = await updatedCoverImage(component.project.id, component.id);

      // delete the previous coverImage if any
      if (component && component.cover) {
        await deleteFile(component.cover.meta);
      }

      return response;
    } catch (error) {
      throw error;
    }
  };
}
