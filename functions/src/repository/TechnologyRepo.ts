import uuid from "uuid/v4";
import { getDb } from "../utils/db";
import { parseDbError } from "../utils/dbHelper";
import { entityNotFoundError } from "../exceptions/genericErrors";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "../utils/constants";

/**
 * ADMIN
 *
 * adds a technology
 *
 * @param {string} name - name of the technology
 * @param {string} categoryId - id of the category to which the technology belongs
 * @param {string} link - optional link to the technology homepage
 */
export const addTechnology = async (name: string, categoryId: string, link?: string) => {
  try {
    const id = uuid();

    const category = await getDb()
      .collection("categories")
      .doc(categoryId)
      .get();

    if (!category.exists) throw entityNotFoundError("Category not found");

    const obj: any = {
      id,
      name,
      category: getDb()
        .collection("categories")
        .doc(categoryId),
      status: STATUS_ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (link) obj.link = link;

    await getDb()
      .collection("technologies")
      .doc(id)
      .set(obj);
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
 * adds a technology
 *
 * @param {string} id - id of the technology
 * @param {string} name - name of the technology
 * @param {string} categoryId - id of the category to which the technology belongs
 * @param {string} link - optional link to the technology homepage
 */
export const updateTechnology = async (
  id: string,
  name: string,
  categoryId: string,
  link?: string,
) => {
  try {
    const category = await getDb()
      .collection("categories")
      .doc(categoryId)
      .get();

    if (!category.exists) throw entityNotFoundError("Category not found");

    const obj: any = {
      name,
      category: getDb()
        .collection("categories")
        .doc(categoryId),
      updatedAt: new Date(),
    };

    if (link) obj.link = link;

    await getDb()
      .collection("technologies")
      .doc(id)
      .update(obj);
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
 * archive a technology
 *
 * @param {string} id - id of the technology that should be archived
 */
export const archiveTechnology = async (id: string) => {
  try {
    await getDb()
      .collection("technologies")
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
 * fetch all technologies
 *
 */
export const fetchTechnologies = async () => {
  try {
    const technologies = await getDb()
      .collection("technologies")
      .where("status", "==", STATUS_ACTIVE)
      .get();

    const result = await Promise.all(technologies.docs.map(row => parseRow(row.data())));

    return result;
  } catch (error) {
    throw parseDbError(error);
  }
};

const parseRow = async (row: FirebaseFirestore.DocumentData) => {
  try {
    const category = await row.category.get();
    row.category = category.data();

    return {
      id: row.id,
      name: row.name,
      category: {
        id: row.category.id,
        name: row.category.name,
      },
      createdAt: row.createdAt.toDate(),
      updatedAt: row.updatedAt.toDate(),
    };
  } catch (error) {
    throw error;
  }
};
