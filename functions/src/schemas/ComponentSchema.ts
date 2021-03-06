import { string, object, date, array } from "yup";
import categorySchema from "~schemas/CategorySchema";
import technologySchema from "~schemas/TechnologySchema";
import cloudStorageUploadSchema from "~schemas/CloudStorageUploadSchema";
import projectSchema from "~schemas/ProjectSchema";
import componentLinkSchema from "~schemas/ComponentLinkSchema";
import gallerySchema from "./GallerySchema";

const componentSchema = () =>
  object().shape({
    id: string().required(),
    name: string().required(),
    summary: string().nullable(true),
    description: string().nullable(true),
    category: categorySchema().required(),
    project: projectSchema().required(),
    technology: array(technologySchema()).default(() => []),
    cover: object()
      .shape({
        link: string().required(),
        meta: cloudStorageUploadSchema()
          .nullable()
          .default(() => null),
      })
      .default(() => null)
      .nullable(),
    logo: object()
      .shape({
        link: string().required(),
        meta: cloudStorageUploadSchema()
          .nullable()
          .default(() => null),
      })
      .default(() => null)
      .nullable(),
    gallery: array(gallerySchema()).default(() => []),
    links: array(componentLinkSchema()).default(() => []),
    createdAt: date()
      .default(() => {
        return new Date();
      })
      .required(),
    updatedAt: date()
      .default(() => {
        return new Date();
      })
      .required(),
  });

export default componentSchema;
