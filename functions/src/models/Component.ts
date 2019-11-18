import uuid from "uuid/v4";
import Category from "./Category";
import Project from "./Project";
import Technology from "./Technology";
import componentSchema from "~schemas/ComponentSchema";
import { IImageUploadModel } from "~interfaces/IImageUploadModel";
import { IComponentLink } from "~interfaces/IComponentLink";
import { STATUS_ACTIVE } from "~utils/constants";

class Component {
  public static init = (
    name: string,
    projectRef: FirebaseFirestore.DocumentReference,
    categoryRef: FirebaseFirestore.DocumentReference,
    technologyRefs: string[] = [],
  ) => {
    const id = uuid();

    return {
      id,
      name,
      cover: null,
      logo: null,
      category: categoryRef,
      project: projectRef,
      technology: technologyRefs,
      gallery: [],
      links: [],
      status: STATUS_ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  public id: string;
  public name: string;
  public cover: IImageUploadModel;
  public logo: IImageUploadModel;
  public category: Category;
  public project: Project;
  public technology: Technology[];
  public gallery: IImageUploadModel[];
  public links: IComponentLink[];
  public createdAt: Date;
  public updatedAt: Date;

  constructor(payload) {
    try {
      const validatedPayload = this.validate(payload);
      this.id = validatedPayload.id;
      this.name = validatedPayload.name;
      this.cover = validatedPayload.cover;
      this.logo = validatedPayload.logo;
      this.category = new Category(validatedPayload.category);
      this.project = new Project(validatedPayload.project);
      this.technology = validatedPayload.technology.map(technology => new Technology(technology));
      this.gallery = validatedPayload.gallery;
      this.links = validatedPayload.links;
      this.createdAt = validatedPayload.createdAt;
      this.updatedAt = validatedPayload.updatedAt;
    } catch (error) {
      throw error;
    }
  }

  private validate = payload => {
    try {
      return componentSchema().validateSync(payload, {
        abortEarly: true,
      });
    } catch (error) {
      throw error;
    }
  };
}

export default Component;
