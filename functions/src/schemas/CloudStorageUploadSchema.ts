import { string, object } from "yup";

const cloudStorageUploadSchema = () =>
  object().shape({
    id: string().required(),
    kind: string().required(),
    selfLink: string().required(),
    bucket: string().required(),
    object: string().required(),
    generation: string().required(),
    entity: string().required(),
    role: string().required(),
    etag: string().required(),
  });

export default cloudStorageUploadSchema;
