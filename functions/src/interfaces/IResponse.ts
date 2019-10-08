export interface IResponse {
  payload?: any;
  error?: IResponseError;
}

interface IResponseError {
  message?: string; // a system generated technical error message
  status?: number; // http status code
  code?: string; // application specific error code
  error_user_title?: string; // user error title
  error_user_msg: string; // a user error message
  metadata?: string; // optional meta data
}
