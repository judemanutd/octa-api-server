import { parseDbError } from "~utils/dbHelper";
import Component from "~models/Component";
import { getDb } from "~utils/db";

export const addComponent = async (
  name: string,
  projectId: string,
  categoryId: string,
  technologyIds: string[],
) => {
  try {
    const projectRef = getDb()
      .collection("projects")
      .doc(projectId);

    const categoryRef = getDb()
      .collection("categories")
      .doc(categoryId);

    const technologyRef = technologyIds.map(technology => `/technologies/${technology}`);

    const insertObj = Component.init(name, projectRef, categoryRef, technologyRef);

    await getDb()
      .collection("components")
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
