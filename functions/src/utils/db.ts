import admin from "firebase-admin";

const TAG = " functions/utils/db.ts ===> ";

let store: FirebaseFirestore.Firestore;

export const connectToServer = firebaseFunctions => {
  try {
    admin.initializeApp(firebaseFunctions.config().firebase);

    store = admin.firestore();

    return store;
  } catch (error) {
    console.error(TAG, error);
    throw error;
  }
};

export const getDb = () => store;
