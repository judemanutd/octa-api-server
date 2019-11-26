import { getDb } from "~utils/db";
import { parseDbError } from "~utils/dbHelper";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "~utils/constants";
import { entityNotFoundError } from "~exceptions/genericErrors";
import Client from "~models/Client";

/**
 * ADMIN
 *
 * adds a client
 *
 * @param {string} name - name of the client
 * @param {string} address - optional address of the client
 */
export const addClient = async (name: string, address?: string) => {
  try {
    const insertObj = Client.init(name, address);

    await getDb()
      .collection("clients")
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
 * update a client
 *
 * @param {string} id - id of the client that should be updated
 * @param {string} name - new name of the client
 * @param {string} address - new address of the client
 */
export const updateClient = async (id: string, name: string, address?: string) => {
  try {
    await getDb()
      .collection("clients")
      .doc(id)
      .update({
        name,
        address,
        updatedAt: new Date(),
      });
    return {
      id,
      message: "Successfully Updated",
    };
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * archive a client
 *
 * @param {string} id - id of the client that should be archived
 */
export const archiveClient = async (id: string) => {
  try {
    // TODO: check if client is attachd to any projects which are active, do not archive until then
    await getDb()
      .collection("clients")
      .doc(id)
      .update({
        status: STATUS_INACTIVE,
        updatedAt: new Date(),
      });
    return {
      id,
      message: "Successfully Archived",
    };
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * fetch a single client
 *
 * @param {string} id - id of the client that should be fetched
 */
export const fetchClient = async (clientId: string) => {
  try {
    const client = await getDb()
      .collection("clients")
      .doc(clientId)
      .get();

    if (!client.exists || (client.exists && client.data().status !== STATUS_ACTIVE))
      throw entityNotFoundError("Client does not exist");

    return parseRow(client.data());
  } catch (error) {
    throw parseDbError(error);
  }
};

/**
 * ADMIN
 *
 * fetch all clients
 *
 */
export const fetchClients = async () => {
  try {
    const clients = await getDb()
      .collection("clients")
      .where("status", "==", STATUS_ACTIVE)
      .get();

    return clients.docs.map(client => parseRow(client.data()));
  } catch (error) {
    throw parseDbError(error);
  }
};

const parseRow = (row: FirebaseFirestore.DocumentData) => {
  try {
    row.createdAt = row.createdAt.toDate();
    row.updatedAt = row.updatedAt.toDate();

    return new Client(row);
  } catch (error) {
    throw error;
  }
};
