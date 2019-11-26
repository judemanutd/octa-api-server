import { IClient } from "./IClient";
import { ICloudStorageUploadResponse } from "./ICloudStorageUploadResponse";

export interface IProject {
  id: string;
  name: string;
  client: IClient;
  cover: {
    link: string;
    meta: ICloudStorageUploadResponse;
  };
  createdAt: string;
  updatedAt: string;
}
