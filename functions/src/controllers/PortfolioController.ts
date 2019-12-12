import { setRequired } from "~utils/helpers";
import { missingParametersError } from "~exceptions/genericErrors";
import { IPortfolioPayload } from "~interfaces/IPortfolioPayload";
import { portfolioPayloadSchema } from "~schemas/PortfolioPayloadSchema";
import ComponentController from "~controllers/ComponentController";
import {
  addPortfolio,
  fetchPortFolios,
  fetchPortFolio,
  updatePortfolio,
  archivePortFolio,
  fetchPublicPortfolio,
} from "~repository/PortfolioRepo";

const componentController: ComponentController = new ComponentController();

export default class PortfolioController {
  /**
   * ADMIN
   *
   * adds a portfolio
   *
   * @param {IPortfolioPayload} payload - payload containing portfolio data
   */
  public addPortfolio = async (payload: IPortfolioPayload) => {
    try {
      const isValid = setRequired(payload);
      if (!isValid) throw missingParametersError();

      let parsedPayload: IPortfolioPayload;

      try {
        parsedPayload = portfolioPayloadSchema().validateSync(payload, {
          abortEarly: true,
        }) as IPortfolioPayload;

        if (
          parsedPayload.componentId.length <= 0 &&
          parsedPayload.projectId.length <= 0 &&
          parsedPayload.technologyId.length <= 0 &&
          parsedPayload.categoryId.length <= 0
        ) {
          throw missingParametersError(
            "Please specify components that need to be included in the portfolio",
          );
        }
      } catch (errorValidate) {
        throw errorValidate;
      }

      const components = await componentController.filterComponents(
        parsedPayload.componentId,
        parsedPayload.projectId,
        parsedPayload.technologyId,
        parsedPayload.categoryId,
      );

      if (components.length <= 0)
        throw missingParametersError(
          "Please specify components that need to be included in the portfolio",
        );

      const result = await addPortfolio(
        parsedPayload.title,
        components,
        payload,
        parsedPayload.description,
      );
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * update a portfolio
   *
   * @param portfolioId - id of the portfolio that needs to be updated
   * @param {IPortfolioPayload} payload - payload containing portfolio data
   */
  public updatePortfolio = async (portfolioId: string, payload: IPortfolioPayload) => {
    try {
      const isValid = setRequired(portfolioId, payload);
      if (!isValid) throw missingParametersError();

      let parsedPayload: IPortfolioPayload;

      try {
        parsedPayload = portfolioPayloadSchema().validateSync(payload, {
          abortEarly: true,
        }) as IPortfolioPayload;

        if (
          parsedPayload.componentId.length <= 0 &&
          parsedPayload.projectId.length <= 0 &&
          parsedPayload.technologyId.length <= 0 &&
          parsedPayload.categoryId.length <= 0
        ) {
          throw missingParametersError(
            "Please specify components that need to be included in the portfolio",
          );
        }
      } catch (errorValidate) {
        throw errorValidate;
      }

      const components = await componentController.filterComponents(
        parsedPayload.componentId,
        parsedPayload.projectId,
        parsedPayload.technologyId,
        parsedPayload.categoryId,
      );

      if (components.length <= 0)
        throw missingParametersError(
          "Please specify components that need to be included in the portfolio",
        );

      const result = await updatePortfolio(
        portfolioId,
        parsedPayload.title,
        components,
        payload,
        parsedPayload.description,
      );
      return result;
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
  public fetchPortFolio = async (portfolioId: string) => {
    try {
      const isValid = setRequired(portfolioId);
      if (!isValid) throw missingParametersError();

      const result = await fetchPortFolio(portfolioId);
      return result;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ADMIN
   *
   * fetch all portfolios
   */
  public fetchPortfolios = async () => {
    try {
      const result = await fetchPortFolios();
      return result;
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
  public fetchPublicPortfolio = async (portfolioCode: string) => {
    try {
      const isValid = setRequired(portfolioCode);
      if (!isValid) throw missingParametersError();

      const result = await fetchPublicPortfolio(portfolioCode);
      return result;
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
  public archivePortfolio = async (portfolioId: string) => {
    try {
      const isValid = setRequired(portfolioId);
      if (!isValid) throw missingParametersError();

      const result = await archivePortFolio(portfolioId);
      return result;
    } catch (error) {
      throw error;
    }
  };
}
