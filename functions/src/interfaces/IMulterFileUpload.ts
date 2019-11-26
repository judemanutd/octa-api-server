export interface IMulterFileUpload {
  fieldname: string; // name of the field when making the request
  originalname: string; // name of the file
  mimetype: string; // mimetype of the file
  encoding: string; // encoding of the file, e.g. 7bit
  buffer: void; // the file
  size: number; // size of the file
}
