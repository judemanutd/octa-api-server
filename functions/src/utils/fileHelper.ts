import admin from "firebase-admin";
import uuid from "uuid/v4";
import { PUBLIC_UPLOAD_PATH } from "../utils/constants";
import { ICloudStorageUploadResponse } from "../interfaces/ICloudStorageUploadResponse";
import { IMulterFileUpload } from "../interfaces/IMulterFileUpload";
import { MakeFilePublicResponse } from "@google-cloud/storage";

/**
 * helper for uploading a file to google cloud storage
 *
 * @param {IMulterFileUpload} coverImage - file that needs to be uploaded to google
 */
export const uploadFile = async (coverImage: IMulterFileUpload) => {
  try {
    const storage = admin.storage();
    const bucket = storage.bucket();
    const bucketFile = bucket.file(`${PUBLIC_UPLOAD_PATH}/${uuid()}`);

    await bucketFile.save(coverImage.buffer, {
      contentType: coverImage.mimetype,
      gzip: true,
    });
    const publicFiles: MakeFilePublicResponse = await bucketFile.makePublic();

    // since google returns an array even for a single upload, since the upload is a success
    // fetch out the first element in the array which has the upload response
    return (publicFiles[0] as unknown) as ICloudStorageUploadResponse;

    // return ((await bucketFile.makePublic()) as unknown) as ICloudStorageUploadResponse;
  } catch (error) {
    throw error;
  }
};

/**
 * helper for deleting a file from google cloud storage
 *
 * @param {ICloudStorageUploadResponse} file - google cloud storage object
 */
export const deleteFile = async (file: ICloudStorageUploadResponse) => {
  try {
    const storage = admin.storage();

    const response = await storage
      .bucket(file.bucket)
      .file(file.object)
      .delete();

    return response;
  } catch (error) {
    // file not found
    if (error.code !== 404) throw error;
  }
};

/**
 * returns the public url for a file uploaded to google storage
 *
 * @param {IMakePublicResponse} object - response from the the make public function call
 */
export const generatePublicLink = (object: ICloudStorageUploadResponse): string => {
  try {
    return `https://storage.googleapis.com/${object.bucket}/${object.object}`;
  } catch (error) {
    throw error;
  }
};
