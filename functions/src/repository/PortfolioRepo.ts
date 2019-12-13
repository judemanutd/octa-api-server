import Component from "~models/Component";
import { getDb } from "~utils/db";
import Portfolio from "~models/Portfolio";
import { STATUS_ACTIVE, STATUS_INACTIVE } from "~utils/constants";
import { parseRow as parseComponentRow } from "~repository/ComponentRepo";
import { entityNotFoundError } from "~exceptions/genericErrors";
import APIError from "~utils/APIError";
import { HTTP_BAD_REQUEST } from "~utils/http_code";
import { IPortfolioPayload } from "~interfaces/IPortfolioPayload";

/**
 * ADMIN
 *
 * add a portfolio
 *
 * @param title - title for the portfolio
 * @param components  - components that belong to the given portfolio
 * @param payload  - original payload so part of it can be saved in the db for future retrieval
 * @param description - optional descrition for the portfolio
 */
export const addPortfolio = async (
  title: string,
  components: Component[],
  payload: IPortfolioPayload,
  description?: string,
) => {
  try {
    const componentRefs = components.map(component =>
      getDb()
        .collection("components")
        .doc(component.id),
    );

    const { categoryId, componentId, projectId, technologyId } = payload;

    const payloadComponentRefs = componentId.map(component =>
      getDb()
        .collection("components")
        .doc(component),
    );

    const payloadCategoryRefs = categoryId.map(category =>
      getDb()
        .collection("categories")
        .doc(category),
    );

    const payloadProjectRefs = projectId.map(project =>
      getDb()
        .collection("projects")
        .doc(project),
    );

    const payloadTechnologyRefs = technologyId.map(technology =>
      getDb()
        .collection("technologies")
        .doc(technology),
    );

    const refs = {
      category: payloadCategoryRefs,
      project: payloadProjectRefs,
      technology: payloadTechnologyRefs,
      component: payloadComponentRefs,
    };

    const insertObj = Portfolio.init(title, componentRefs, refs, description);

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
 * @param payload  - original payload so part of it can be saved in the db for future retrieval
 * @param description - optional descrition for the portfolio
 */
export const updatePortfolio = async (
  portfolioId: string,
  title: string,
  components: Component[],
  payload: IPortfolioPayload,
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

    const { categoryId, componentId, projectId, technologyId } = payload;

    const payloadComponentRefs = componentId.map(component =>
      getDb()
        .collection("components")
        .doc(component),
    );

    const payloadCategoryRefs = categoryId.map(category =>
      getDb()
        .collection("categories")
        .doc(category),
    );

    const payloadProjectRefs = projectId.map(project =>
      getDb()
        .collection("projects")
        .doc(project),
    );

    const payloadTechnologyRefs = technologyId.map(technology =>
      getDb()
        .collection("technologies")
        .doc(technology),
    );

    const refs = {
      category: payloadCategoryRefs,
      project: payloadProjectRefs,
      technology: payloadTechnologyRefs,
      component: payloadComponentRefs,
    };

    obj.refs = refs;

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
 * @param fetchDetails - indicates if complete details for a component need to be fetched
 */
export const fetchPortFolio = async (portfolioId: string, fetchDetails: boolean = false) => {
  try {
    const portfolio = await getDb()
      .collection("portfolios")
      .doc(portfolioId)
      .get();

    if (!portfolio.exists || (portfolio.exists && portfolio.data().status !== STATUS_ACTIVE))
      throw entityNotFoundError("Portfolio does not exist");

    return parseRow(portfolio.data(), fetchDetails);
  } catch (error) {
    throw error;
  }
};

/**
 * PUBLIC
 *
 * fetch a single portfolio for display to the public
 *
 * @param portfolioCode - unique code of the portfolio that needs to be fetched
 */
export const fetchPublicPortfolio = async (portfolioCode: string) => {
  try {
    const portfoliosQuery = await getDb()
      .collection("portfolios")
      .where("code", "==", portfolioCode)
      .get();

    const promises = portfoliosQuery.docs.map(item => parseRow(item.data(), true, true));
    const portfolios = await Promise.all(promises);

    if (portfolios.length !== 1) {
      // portfolio not found
      throw entityNotFoundError("Portfolio does not exist");
    }

    const portfolio: any = portfolios[0];

    if (portfolio.status !== STATUS_ACTIVE) throw entityNotFoundError("Portfolio does not exist");

    return portfolio;
  } catch (error) {
    throw error;
  }
};

/**
 * ADMIN
 *
 * fetch all portfolios
 *
 */
export const fetchPortFolios = async () => {
  try {
    const portfolios = await getDb()
      .collection("portfolios")
      .where("status", "==", STATUS_ACTIVE)
      .get();

    const promises = portfolios.docs.map(item => parseRow(item.data()));

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
  isPublic: boolean = false,
) => {
  try {
    if (showComponents) {
      const componentPromises = row.components.map(
        async (componentRef: FirebaseFirestore.DocumentReference) => {
          const component: FirebaseFirestore.DocumentSnapshot = await componentRef.get();
          const componentData = component.exists
            ? await parseComponentRow(component.data(), isPublic)
            : null;
          return componentData;
        },
      );
      row.components = await Promise.all(componentPromises);

      row.createdAt = row.createdAt.toDate();
      row.updatedAt = row.updatedAt.toDate();

      return new Portfolio(row);
    } else {
      const references = row.refs;

      let categoryData = [];
      let componentData = [];
      let projectData = [];
      let technologyData = [];

      if (references) {
        const categoryPromises = row.refs.category.map(
          async (categoryRef: FirebaseFirestore.DocumentReference) => {
            const category = await categoryRef.get();
            const categoryData = category.exists ? category.data() : null;
            return {
              id: categoryData.id,
              name: categoryData.name,
            };
          },
        );

        const componentPromises = row.refs.component.map(
          async (componentRef: FirebaseFirestore.DocumentReference) => {
            const component = await componentRef.get();
            const componentData = component.exists ? component.data() : null;
            return {
              id: componentData.id,
              name: componentData.name,
            };
          },
        );

        const projectPromises = row.refs.project.map(
          async (projectRef: FirebaseFirestore.DocumentReference) => {
            const project = await projectRef.get();
            const projectData = project.exists ? project.data() : null;
            return {
              id: projectData.id,
              name: projectData.name,
            };
          },
        );

        const technologyPromises = row.refs.technology.map(
          async (technologyRef: FirebaseFirestore.DocumentReference) => {
            const technology = await technologyRef.get();
            const technologyData = technology.exists ? technology.data() : null;
            return {
              id: technologyData.id,
              name: technologyData.name,
            };
          },
        );

        const [category, component, project, technology] = await Promise.all([
          Promise.all(categoryPromises),
          Promise.all(componentPromises),
          Promise.all(projectPromises),
          Promise.all(technologyPromises),
        ]);

        categoryData = category;
        componentData = component;
        projectData = project;
        technologyData = technology;
      }

      return {
        id: row.id,
        title: row.title,
        description: row.description,
        category: categoryData,
        component: componentData,
        project: projectData,
        technology: technologyData,
        createdAt: row.createdAt.toDate(),
        updatedAt: row.updatedAt.toDate(),
      };
    }
  } catch (error) {
    throw error;
  }
};
