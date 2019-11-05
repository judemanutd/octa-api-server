import { setRequired } from "../utils/helpers";
import { missingParametersError } from "../exceptions/genericErrors";
import {
  addClient,
  updateClient,
  archiveClient,
  fetchClients,
  fetchClient,
} from "../repository/ClientRepo";

export default class ClientController {
  /**
   * ADMIN
   *
   * adds a client
   *
   * @param {string} name - name of the client
   * @param {string} address - optional address of the client
   */
  public addClient = async (name: string, address?: string) => {
    try {
      const isValid = setRequired(name);
      if (!isValid) throw missingParametersError();

      const result = await addClient(name, address);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * update a client
   *
   * @param {string} id - id of the client that should be updated
   * @param {string} name - new name of the client
   * @param {string} address - new address of the client
   */
  public updateClient = async (id: string, name: string, address?: string) => {
    try {
      const isValid = setRequired(id, name);
      if (!isValid) throw missingParametersError();

      const result = await updateClient(id, name, address);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * archive a client
   *
   * @param {string} id - id of the client that should be archived
   */
  public archiveClient = async (id: string) => {
    try {
      const isValid = setRequired(id);
      if (!isValid) throw missingParametersError();

      const result = await archiveClient(id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * fetch all clients
   *
   */
  public fetchClients = async () => {
    try {
      const result = await fetchClients();
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * fetch a single client
   *
   * @param {string} id - id of the client that should be fetched
   */
  public fetchClient = async (clientId: string) => {
    try {
      const res = await fetchClient(clientId);
      return res;
    } catch (error) {
      throw error;
    }
  };
}
