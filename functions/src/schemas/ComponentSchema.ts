import { string, object, date, array } from "yup";
import categorySchema from "~schemas/CategorySchema";
import technologySchema from "~schemas/TechnologySchema";
import cloudStorageUploadSchema from "~schemas/CloudStorageUploadSchema";
import projectSchema from "~schemas/ProjectSchema";

const componentSchema = () =>
  object().shape({
    id: string().required(),
    name: string().required(),
    category: categorySchema().required(),
    project: projectSchema().required(),
    technology: array(technologySchema()).default(() => []),
    cover: object()
      .shape({
        link: string().required(),
        meta: cloudStorageUploadSchema().required(),
      })
      .default(() => null)
      .nullable(),
    logo: object()
      .shape({
        link: string().required(),
        meta: cloudStorageUploadSchema().required(),
      })
      .default(() => null)
      .nullable(),
    gallery: array(
      object().shape({
        link: string().required(),
        meta: cloudStorageUploadSchema().required(),
      }),
    ).default(() => []),
    links: array(
      object().shape({
        type: string().required(),
        url: string().required(),
        text: string().required(),
      }),
    ).default(() => []),
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
