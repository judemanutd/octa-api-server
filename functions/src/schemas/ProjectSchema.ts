import { string, object, number, date } from "yup";
import clientSchema from "../schemas/ClientSchema";
import cloudStorageUploadSchema from "../schemas/CloudStorageUploadSchema";

const projectSchema = () =>
  object().shape({
    id: string().required(),
    name: string().required(),
    client: clientSchema().required(),
    cover: object()
      .shape({
        link: string().required(),
        meta: cloudStorageUploadSchema().required(),
      })
      .nullable(),
    startDate: date()
      .default(() => {
        return new Date();
      })
      .nullable(),
    endDate: date()
      .default(() => {
        return new Date();
      })
      .nullable(),
    cost: number().nullable(),
    currency: string().nullable(),
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
