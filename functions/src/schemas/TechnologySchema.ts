import { string, object, date } from "yup";
import categorySchema from "~schemas/CategorySchema";

const technologySchema = () =>
  object().shape({
    id: string().required(),
    name: string().required(),
    category: categorySchema().required(),
    link: string()
      .nullable(true)
      .default(() => null),
    icon: object()
      .shape({
        type: string().required(),
        name: string().required(),
      })
      .nullable(true)
      .default(() => null),
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
