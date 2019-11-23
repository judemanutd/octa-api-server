import { string, object, number, date, array } from "yup";
import componentSchema from "./ComponentSchema";

const portfolioSchema = () =>
  object().shape({
    id: string().required(),
    title: string().required(),
    description: string().nullable(true),
    components: array(componentSchema()).default(() => []),
    status: number().required(),
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

export default portfolioSchema;
