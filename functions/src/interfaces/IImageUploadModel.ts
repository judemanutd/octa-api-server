import { ICloudStorageUploadResponse } from "./ICloudStorageUploadResponse";

export interface IImageUploadModel {
  link: string;
  meta?: ICloudStorageUploadResponse;
}
