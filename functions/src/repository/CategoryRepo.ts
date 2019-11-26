import { getDb } from "~utils/db";
import { parseDbError } from "~utils/dbHelper";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "~utils/constants";
import Category from "~models/Category";
import { entityNotFoundError } from "~exceptions/genericErrors";
import { IIcon } from "~interfaces/IIcon";

/**
 * ADMIN
 *
 * adds a category
 *
 * @param {string} name - name of the category
 * @param {IIcon} icon - accepts the optional icon meta data
 */
export const addCategory = async (name: string, icon?: IIcon) => {
  try {
    const obj = Category.init(name, icon);

    await getDb()
      .collection("categories")
      .doc(obj.id)
      .set(obj);
    return {
      id: obj.id,
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
 * @param {IIcon} icon - accepts the optional icon meta data
 */
export const updateCategory = async (id: string, name: string, icon?: IIcon) => {
  try {
    const updateObj: any = {
      name,
      updatedAt: new Date(),
    };

    if (icon) updateObj.icon = icon;

    await getDb()
      .collection("categories")
      .doc(id)
      .update(updateObj);
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

/**
 * ADMIN
 *
 * fetch a single category
 *
 * @param {string} categoryId - id of the category
 */
export const fetchCategory = async (categoryId: string) => {
  try {
    const category = await getDb()
      .collection("categories")
      .doc(categoryId)
      .get();

    if (!category.exists || (category.exists && category.data().status !== STATUS_ACTIVE))
      throw entityNotFoundError("Category does not exist");

    return parseRow(category.data());
  } catch (error) {
    throw parseDbError(error);
  }
};

export const parseRow = (row: FirebaseFirestore.DocumentData) => {
  try {
    row.createdAt = row.createdAt.toDate();
    row.updatedAt = row.updatedAt.toDate();

    return new Category(row);
  } catch (error) {
    throw error;
  }
};
