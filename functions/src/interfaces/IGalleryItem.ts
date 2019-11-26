import { ICloudStorageUploadResponse } from "./ICloudStorageUploadResponse";

export interface IGalleryItem {
  id: string;
  name: string;
  description: string;
  link: string;
  meta?: ICloudStorageUploadResponse;
}
