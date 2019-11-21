import uuid from "uuid/v4";
import schema from "~schemas/CategorySchema";
import { STATUS_ACTIVE } from "~utils/constants";

class Category {
  public static init = (name: string) => {
    const id = uuid();

    return {
      id,
      name,
      status: STATUS_ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  public id: string;
  public name: string;
  public status: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(payload) {
    const validatedPayload = this.validate(payload);
    this.id = validatedPayload.id;
    this.name = validatedPayload.name;
    this.status = validatedPayload.status;
    this.createdAt = validatedPayload.createdAt;
    this.updatedAt = validatedPayload.updatedAt;
  }

  protected validate = payload => {
    try {
      return schema().validateSync(payload);
    } catch (error) {
      throw error;
    }
  };
}

export default Category;
