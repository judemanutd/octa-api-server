import {
  addCategory,
  fetchCategories,
  updateCategory,
  archiveCategory,
} from "~repository/CategoryRepo";
import { setRequired } from "~utils/helpers";
import { missingParametersError } from "~exceptions/genericErrors";

export default class CategoryController {
  /**
   * ADMIN
   *
   * adds a category
   *
   * @param {string} name - name of the category
   */
  public addCategory = async (name: string) => {
    try {
      const isValid = setRequired(name);
      if (!isValid) throw missingParametersError();

      const category = await addCategory(name);
      return category;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * update a category
   *
   * @param {string} id - id of the category that should be updated
   * @param {string} name - new name of the category
   */
  public updateCategory = async (id: string, name: string) => {
    try {
      const isValid = setRequired(id, name);
      if (!isValid) throw missingParametersError();

      const category = await updateCategory(id, name);
      return category;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * archive a category
   *
   * @param {string} id - id of the category that should be archived
   */
  public archiveCategory = async (id: string) => {
    try {
      const isValid = setRequired(id);
      if (!isValid) throw missingParametersError();

      const category = await archiveCategory(id);
      return category;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * fetch all categories
   *
   */
  public fetchCategories = async () => {
    try {
      const categories = await fetchCategories();
      return categories;
    } catch (error) {
      throw error;
    }
  };
}
