import { string, object, date } from "yup";
import categorySchema from "~schemas/CategorySchema";

const technologySchema = () =>
  object().shape({
    id: string().required(),
    name: string().required(),
    category: categorySchema().required(),
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

export default technologySchema;
