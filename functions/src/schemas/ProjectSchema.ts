import { string, object, number, date, array } from "yup";
import clientSchema from "~schemas/ClientSchema";
import cloudStorageUploadSchema from "~schemas/CloudStorageUploadSchema";
import gallerySchema from "./GallerySchema";

const projectSchema = () =>
  object().shape({
    id: string().required(),
    name: string().required(),
    client: clientSchema().required(),
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
    startDate: date()
      .default(() => {
        return null;
      })
      .nullable(),
    endDate: date()
      .default(() => null)
      .nullable(),
    cost: number()
      .default(() => 0)
      .nullable(),
    currency: string()
      .default(() => null)
      .nullable(),
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

export default projectSchema;
