import { string, object, array } from "yup";

export const portfolioPayloadSchema = () =>
  object().shape({
    title: string().required(),
    description: string().required(),
    componentId: array(string()).default(() => []),
    technologyId: array(string()).default(() => []),
    categoryId: array(string()).default(() => []),
    projectId: array(string()).default(() => []),
  });

export default portfolioPayloadSchema;
