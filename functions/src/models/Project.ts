import uuid from "uuid/v4";
import admin = require("firebase-admin");
import Client from "./Client";
import projectSchema from "~schemas/ProjectSchema";
import { ICloudStorageUploadResponse } from "~interfaces/ICloudStorageUploadResponse";
import { IGalleryItem } from "~interfaces/IGalleryItem";
import { STATUS_ACTIVE } from "~utils/constants";
import { generatePublicLink } from "~utils/fileHelper";
import { IImageUploadModel } from "~interfaces/IImageUploadModel";

class Project {
  public static init = (name: string, clientRef: FirebaseFirestore.DocumentReference) => {
    const id = uuid();

    return {
      id,
      name,
      cover: null,
      logo: null,
      gallery: [],
      startDate: null,
      endDate: null,
      cost: 0,
      currency: null,
      client: clientRef,
      status: STATUS_ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  public static initGalleryItem = (
    file: ICloudStorageUploadResponse,
    name?: string,
    description?: string,
  ) => {
    const id = uuid();

    return admin.firestore.FieldValue.arrayUnion({
      id,
      name: name || null,
      description: description || null,
      link: generatePublicLink(file),
      meta: file,
    });
  };

  public id: string;
  public name: string;
  public client: Client;
  public cover: IImageUploadModel;
  public logo: IImageUploadModel;
  public gallery: IGalleryItem[];
  public startDate: Date;
  public endDate: Date;
  public cost: number;
  public currency: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(payload) {
    try {
      const validatedPayload = this.validate(payload);
      this.id = validatedPayload.id;
      this.name = validatedPayload.name;
      this.cover = validatedPayload.cover;
      this.logo = validatedPayload.logo;
      this.gallery = validatedPayload.gallery;
      this.client = new Client(validatedPayload.client);
      this.startDate = validatedPayload.startDate;
      this.endDate = validatedPayload.endDate;
      this.cost = validatedPayload.cost;
      this.currency = validatedPayload.currency;
      this.createdAt = validatedPayload.createdAt;
      this.updatedAt = validatedPayload.updatedAt;
    } catch (error) {
      throw error;
    }
  }

  private validate = payload => {
    try {
      return projectSchema().validateSync(payload, {
        abortEarly: true,
      });
    } catch (error) {
      throw error;
    }
  };
}

export default Project;
