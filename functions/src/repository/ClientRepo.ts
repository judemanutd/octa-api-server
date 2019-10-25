import uuid from "uuid/v4";
import { getDb } from "../utils/db";
import { parseDbError } from "../utils/dbHelper";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "../utils/constants";

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
    const id = uuid();

    await getDb()
      .collection("clients")
      .doc(id)
      .set({
        id,
        name,
        address,
        status: STATUS_ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    return {
      id,
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
    return {
      id: row.id,
      name: row.name,
      address: row.address,
      createdAt: row.createdAt.toDate(),
      updatedAt: row.updatedAt.toDate(),
    };
  } catch (error) {
    throw error;
  }
};
