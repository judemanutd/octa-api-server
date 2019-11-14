import { string, object, date } from "yup";

const categorySchema = () =>
  object().shape({
    id: string().required(),
    name: string().required(),
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
