import Category from "~models/Category";
import algolia from "algoliasearch";
import { TABLE_CATEGORY_INDEX_NAME } from "~utils/constants";

const client = algolia("", "", {
  _useRequestCache: true,
});

export const manageCategory = async (category: Category) => {
  try {
    const index = client.initIndex(TABLE_CATEGORY_INDEX_NAME);
    await index.setSettings({
      searchableAttributes: ["name"],
    });
    const result = await index.addObject(category, category.id);
    return result;
  } catch (error) {
    throw error;
  }
};
