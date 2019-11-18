import { setRequired } from "~utils/helpers";
import { missingParametersError } from "~exceptions/genericErrors";
import ProjectController from "~controllers/ProjectController";
import CategoryController from "~controllers/CategoryController";
import { addComponent } from "~repository/ComponentRepo";

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
   */
  public addComponent = async (
    name: string,
    projectId: string,
    categoryId: string,
    technologyIds: string[] = [],
  ) => {
    try {
      const isValid = setRequired(name, projectId, categoryId);
      if (!isValid) throw missingParametersError();

      const project = await projectController.fetchProject(projectId);
      const category = await categoryController.fetchCategory(categoryId);

      // TODO: check if technologies are valid

      const response = await addComponent(name, project.id, category.id, technologyIds);

      return response;
    } catch (error) {
      throw error;
    }
  };
}
