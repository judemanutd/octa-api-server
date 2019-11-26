import { string, object } from "yup";
import cloudStorageUploadSchema from "./CloudStorageUploadSchema";

const gallerySchema = () =>
  object().shape({
    id: string().required(),
    name: string().nullable(true),
    description: string().nullable(true),
    link: string().required(),
    meta: cloudStorageUploadSchema()
      .nullable()
      .default(() => null),
  });

export default gallerySchema;
