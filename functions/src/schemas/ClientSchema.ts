import { string, object, date } from "yup";

const clientSchema = () =>
  object().shape({
    id: string().required(),
    name: string().required(),
    address: string().nullable(),
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

export default clientSchema;
