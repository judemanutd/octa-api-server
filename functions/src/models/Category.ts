import uuid from "uuid/v4";
import schema from "~schemas/CategorySchema";
import { STATUS_ACTIVE } from "~utils/constants";
import { IIcon } from "~interfaces/IIcon";

class Category {
  public static init = (name: string, icon?: IIcon) => {
    const id = uuid();

    return {
      id,
      name,
      icon: icon || null,
      status: STATUS_ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  public id: string;
  public name: string;
  public icon?: IIcon;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(payload) {
    const validatedPayload = this.validate(payload);
    this.id = validatedPayload.id;
    this.name = validatedPayload.name;
    this.icon = validatedPayload.icon;
    this.createdAt = validatedPayload.createdAt;
    this.updatedAt = validatedPayload.updatedAt;
  }

  private validate = payload => {
    try {
      return schema().validateSync(payload);
    } catch (error) {
      throw error;
    }
  };
}

export default Category;
