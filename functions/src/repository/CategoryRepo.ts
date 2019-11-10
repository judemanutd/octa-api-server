import uuid from "uuid/v4";
import { getDb } from "~utils/db";
import { parseDbError } from "~utils/dbHelper";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "~utils/constants";

/**
 * ADMIN
 *
 * adds a category
 *
 * @param {string} name - name of the category
 */
export const addCategory = async (name: string) => {
  try {
    const id = uuid();

    await getDb()
      .collection("categories")
      .doc(id)
      .set({
        id,
        name,
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
 * update a category
 *
 * @param {string} id - id of the category that should be updated
 * @param {string} name - new name of the category
 */
export const updateCategory = async (id: string, name: string) => {
  try {
    await getDb()
      .collection("categories")
      .doc(id)
      .update({
        name,
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
 * archive a category
 *
 * @param {string} id - id of the category that should be archived
 */
export const archiveCategory = async (id: string) => {
  try {
    await getDb()
      .collection("categories")
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
 * fetch all categories
 *
 */
export const fetchCategories = async () => {
  try {
    const categories = await getDb()
      .collection("categories")
      .where("status", "==", STATUS_ACTIVE)
      .get();

    return categories.docs.map(category => parseRow(category.data()));
  } catch (error) {
    throw parseDbError(error);
  }
};

const parseRow = (row: FirebaseFirestore.DocumentData) => {
  try {
    return {
      id: row.id,
      name: row.name,
      createdAt: row.createdAt.toDate(),
      updatedAt: row.updatedAt.toDate(),
    };
  } catch (error) {
    throw error;
  }
};
