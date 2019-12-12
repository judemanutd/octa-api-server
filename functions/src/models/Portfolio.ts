import uuid from "uuid/v4";
import nanoid from "nanoid";
import Component from "./Component";
import { STATUS_ACTIVE } from "~utils/constants";
import portfolioSchema from "~schemas/PortfolioSchema";
import IPortfolioRefs from "~interfaces/IPortfolioRefs";

class Portfolio {
  public static init = (
    title: string,
    componentIdRefs: FirebaseFirestore.DocumentReference[],
    refs: IPortfolioRefs,
    description?: string,
  ) => {
    const id = uuid();

    return {
      id,
      title,
      description,
      code: nanoid(10),
      components: componentIdRefs,
      refs,
      status: STATUS_ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  public id: string;
  public title: string;
  public description: string;
  public status: number;
  public components: Component[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(payload) {
    try {
      const validatedPayload = this.validate(payload);
      this.id = validatedPayload.id;
      this.title = validatedPayload.title;
      this.description = validatedPayload.description;
      this.components = validatedPayload.components.map(
        componentSchema => new Component(componentSchema),
      );
      this.status = validatedPayload.status;
      this.createdAt = validatedPayload.createdAt;
      this.updatedAt = validatedPayload.updatedAt;
    } catch (error) {
      throw error;
    }
  }

  private validate = payload => {
    try {
      return portfolioSchema().validateSync(payload, {
        abortEarly: true,
      });
    } catch (error) {
      throw error;
    }
  };
}

export default Portfolio;
