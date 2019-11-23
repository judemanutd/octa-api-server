import * as admin from "firebase-admin";
// tslint:disable-next-line: no-import-side-effect
import "firebase-functions";

const TAG = " functions/utils/db.ts ===> ";

let store: FirebaseFirestore.Firestore;

export const connectToServer = () => {
  try {
    admin.initializeApp();
    store = admin.firestore();

    const settings = { timestampsInSnapshots: true };
    store.settings(settings);

    return store;
  } catch (error) {
    console.error(TAG, error);
    throw error;
  }
};

export const getDb = (): FirebaseFirestore.Firestore => store;
