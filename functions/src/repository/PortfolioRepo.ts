import Component from "~models/Component";
import { getDb } from "~utils/db";
import Portfolio from "~models/Portfolio";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "~utils/constants";
import { parseRow as parseComponentRow } from "~repository/ComponentRepo";
import { entityNotFoundError } from "~exceptions/genericErrors";
import APIError from "~utils/APIError";
import { HTTP_BAD_REQUEST } from "~utils/http_code";

/**
 * ADMIN
 *
 * add a portfolio
 *
 * @param title - title for the portfolio
 * @param components  - components that belong to the given portfolio
 * @param description - optional descrition for the portfolio
 */
export const addPortfolio = async (
  title: string,
  components: Component[],
  description?: string,
) => {
  try {
    const componentRefs = components.map(component =>
      getDb()
        .collection("components")
        .doc(component.id),
    );

    const insertObj = Portfolio.init(title, componentRefs, description);

    await getDb()
      .collection("portfolios")
      .doc(insertObj.id)
      .set(insertObj);

    return {
      id: insertObj.id,
      message: "Successfully Added",
    };
  } catch (error) {
    throw error;
  }
};

/**
 * ADMIN
 *
 * update a portfolio details
 *
 * @param portfolioId - id of the portfolio that needs to be updated
 * @param title - title for the portfolio
 * @param components  - components that belong to the given portfolio
 * @param description - optional descrition for the portfolio
 */
export const updatePortfolio = async (
  portfolioId: string,
  title: string,
  components: Component[],
  description?: string,
) => {
  try {
    let shouldUpdate = false;

    const obj: any = {
      title,
      updatedAt: new Date(),
    };

    if (description) {
      shouldUpdate = true;
      obj.description = description;
    }

    const componentRefs = components.map(component =>
      getDb()
        .collection("components")
        .doc(component.id),
    );

    obj.components = componentRefs;

    if (!shouldUpdate) {
      throw new APIError("No attributes specified for updation", undefined, HTTP_BAD_REQUEST);
    }

    await getDb()
      .collection("portfolios")
      .doc(portfolioId)
      .update(obj);

    return {
      id: portfolioId,
      message: "Successfully Updated",
    };
  } catch (error) {
    throw error;
  }
};

/**
 * ADMIN
 *
 * fetch a single portfolio
 *
 * @param portfolioId - id of the portfolio that needs to be fetched
 */
export const fetchPortFolio = async (portfolioId: string) => {
  try {
    const portfolio = await getDb()
      .collection("portfolios")
      .doc(portfolioId)
      .get();

    if (!portfolio.exists || (portfolio.exists && portfolio.data().status !== STATUS_ACTIVE))
      throw entityNotFoundError("Portfolio does not exist");

    return parseRow(portfolio.data(), true);
  } catch (error) {
    throw error;
  }
};

/**
 * ADMIN
 *
 * fetch all portfolios
 *
 * @param showComponents - boolean to indicate if the components should be fetched as well
 */
export const fetchPortFolios = async (showComponents: boolean = false) => {
  try {
    const portfolios = await getDb()
      .collection("portfolios")
      .where("status", "==", STATUS_ACTIVE)
      .get();

    const promises = portfolios.docs.map(project => parseRow(project.data(), showComponents));

    return await Promise.all(promises);
  } catch (error) {
    throw error;
  }
};

/**
 * ADMIN
 *
 * archived a single portfolio
 *
 * @param portfolioId - id of the portfolio that needs to be archived
 */
export const archivePortFolio = async (portfolioId: string) => {
  try {
    await getDb()
      .collection("portfolios")
      .doc(portfolioId)
      .update({
        status: STATUS_INACTIVE,
        updatedAt: new Date(),
      });

    return {
      id: portfolioId,
      message: "Successfully Archived",
    };
  } catch (error) {
    throw error;
  }
};

export const parseRow = async (
  row: FirebaseFirestore.DocumentData,
  showComponents: boolean = false,
) => {
  try {
    if (showComponents) {
      const componentPromises = row.components.map(
        async (componentRef: FirebaseFirestore.DocumentReference) => {
          const component: FirebaseFirestore.DocumentSnapshot = await componentRef.get();
          const componentData = component.exists ? await parseComponentRow(component.data()) : null;
          return componentData;
        },
      );
      row.components = await Promise.all(componentPromises);
    } else {
      row.components = [];
    }

    row.createdAt = row.createdAt.toDate();
    row.updatedAt = row.updatedAt.toDate();

    return new Portfolio(row);
  } catch (error) {
    throw error;
  }
};
