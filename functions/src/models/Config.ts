import { ISystemConfig } from "~interfaces/ISystemConfig";
import { serverError } from "~exceptions/genericErrors";

class Config {
  public static saveAlgoliaConfig = (adminApiKey: string, applicationId: string) => {
    try {
      if (adminApiKey === null || applicationId === null)
        throw serverError("Unable to initialize config");

      Config.config.ALGOLIA_ADMIN_API_KEY = adminApiKey;
      Config.config.ALGOLIA_APPLICATION_ID = applicationId;
    } catch (error) {
      throw error;
    }
  };

  public static fetchConfig = () => Config.config;

  private static config: ISystemConfig = {
    ALGOLIA_ADMIN_API_KEY: null,
    ALGOLIA_APPLICATION_ID: null,
  };
}

export default Config;
