import uuid from "uuid/v4";
import clientSchema from "../schemas/ClientSchema";
import { STATUS_ACTIVE } from "../utils/constants";

class Client {
  public static init = (name: string, address?: string) => {
    const id = uuid();

    return {
      id,
      name,
      address,
      status: STATUS_ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  public id: string;
  public name: string;
  public address: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(payload) {
    const validatedPayload = this.validate(payload);
    this.id = validatedPayload.id;
    this.name = validatedPayload.name;
    this.address = validatedPayload.address;
    this.createdAt = validatedPayload.createdAt;
    this.updatedAt = validatedPayload.updatedAt;
  }

  private validate = payload => {
    try {
      return clientSchema().validateSync(payload);
    } catch (error) {
      throw error;
    }
  };
}

export default Client;
