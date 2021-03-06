import {
  addCategory,
  fetchCategories,
  updateCategory,
  archiveCategory,
  fetchCategory,
} from "~repository/CategoryRepo";
import { setRequired } from "~utils/helpers";
import { missingParametersError } from "~exceptions/genericErrors";
import { IIcon } from "~interfaces/IIcon";

export default class CategoryController {
  /**
   * ADMIN
   *
   * adds a category
   *
   * @param {string} name - name of the category
   * @param {IIcon} icon - accepts the optional icon meta data
   */
  public addCategory = async (name: string, icon?: IIcon) => {
    try {
      const isValid = setRequired(name);
      if (!isValid) throw missingParametersError();

      const category = await addCategory(name, icon);
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
   * @param {IIcon} icon - accepts the optional icon meta data
   */
  public updateCategory = async (id: string, name: string, icon?: IIcon) => {
    try {
      const isValid = setRequired(id, name);
      if (!isValid) throw missingParametersError();

      const category = await updateCategory(id, name, icon);
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

  /**
   * ADMIN
   *
   * fetch a single category
   *
   * @param {string} categoryId - id of the category
   */
  public fetchCategory = async (categoryId: string) => {
    try {
      const categories = await fetchCategory(categoryId);
      return categories;
    } catch (error) {
      throw error;
    }
  };
}
