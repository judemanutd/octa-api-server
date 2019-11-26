import { string, object } from "yup";

const componentLinkSchema = () =>
  object().shape({
    type: string().required(),
    url: string().required(),
    text: string().required(),
  });

export default componentLinkSchema;
