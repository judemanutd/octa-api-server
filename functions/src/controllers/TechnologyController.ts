import { setRequired } from "~utils/helpers";
import { missingParametersError } from "~exceptions/genericErrors";
import {
  addTechnology,
  updateTechnology,
  archiveTechnology,
  fetchTechnologies,
} from "~repository/TechnologyRepo";
import { IIcon } from "~interfaces/IIcon";

export default class TechnologyController {
  /**
   * ADMIN
   *
   * adds a technology
   *
   * @param {string} name - name of the technology
   * @param {string} categoryId - id of the category to which the technology belongs
   * @param {string} link - optional link to the technology homepage
   * @param {IIcon} icon - accepts the optional icon meta data
   */
  public addTechnology = async (name: string, categoryId: string, link?: string, icon?: IIcon) => {
    try {
      const isValid = setRequired(name, categoryId);
      if (!isValid) throw missingParametersError();

      const result = await addTechnology(name, categoryId, link, icon);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * adds a technology
   *
   * @param {string} id - id of the technology
   * @param {string} name - name of the technology
   * @param {string} categoryId - id of the category to which the technology belongs
   * @param {string} link - optional link to the technology homepage
   * @param {IIcon} icon - accepts the optional icon meta data
   */
  public updateTechnology = async (
    id: string,
    name: string,
    categoryId: string,
    link?: string,
    icon?: IIcon,
  ) => {
    try {
      const isValid = setRequired(id, name);
      if (!isValid) throw missingParametersError();

      const result = await updateTechnology(id, name, categoryId, link, icon);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * archive a technology
   *
   * @param {string} id - id of the technology that should be archived
   */
  public archiveTechnology = async (id: string) => {
    try {
      const isValid = setRequired(id);
      if (!isValid) throw missingParametersError();

      const result = await archiveTechnology(id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * fetch all technologies
   *
   */
  public fetchTechnologies = async () => {
    try {
      const result = await fetchTechnologies();
      return result;
    } catch (error) {
      throw error;
    }
  };
}
