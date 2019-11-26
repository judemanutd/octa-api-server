import AnalyticsRepo from "~repository/AnalyticsRepo";
import { IAnalyticsModel } from "~interfaces/IAnalyticsModel";

export default class AnalyticsController {
  private repo: AnalyticsRepo;

  constructor() {
    this.repo = new AnalyticsRepo();
  }

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
      await this.repo.logPortfolioRequest(portfolioId, payload);

      return true;
    } catch (error) {
      throw error;
    }
  };
}
