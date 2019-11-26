import { HTTP_INTERNAL_SERVER_ERROR } from "./http_code";

export default class APIError extends Error {
  public status: number;
  public stack: any;
  public code: any;
  public metadata: any;

  constructor(
    message: string = "Internal server error",
    stack?: any,
    status = HTTP_INTERNAL_SERVER_ERROR,
    code?: string,
    metadata?: any,
  ) {
    super(message);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, APIError.prototype);

    this.status = status;
    this.stack = stack;
    this.code = code;
    this.metadata = metadata;
  }
}
