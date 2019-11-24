import uuid from "uuid/v4";
import { getDb } from "~utils/db";
import { IAnalyticsModel } from "~interfaces/IAnalyticsModel";

export default class AnalyticsRepo {
  /**
   * ADMIN
   *
   * logs a portfolio request made
   *
   * @param {string} portfolioId - id of the portfolio that was queried
   * @param {string} payload - analytics payload that needs to be saved
   */
  public logPortfolioRequest = async (portfolioId: string, payload: IAnalyticsModel) => {
    try {
      const id = uuid();
      await getDb()
        .collection("portfolios")
        .doc(portfolioId)
        .collection("analytics")
        .doc(id)
        .set({
          id,
          ...JSON.parse(JSON.stringify(payload)),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
    } catch (error) {
      throw error;
    }
  };
}
