import { string, object, date, number } from "yup";

const categorySchema = () =>
  object().shape({
    id: string().required(),
    name: string().required(),
    status: number()
      .integer()
      .required(),
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

export default categorySchema;
