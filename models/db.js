import admin from "firebase-admin";
import fs from "fs";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-config.json";

if (!fs.existsSync(serviceAccountPath)) {
  console.error(`Firebase service account introuvable: ${serviceAccountPath}. Placez votre fichier ou mettez à jour FIREBASE_SERVICE_ACCOUNT_PATH dans .env (voir .env.example).`);
  throw new Error(`Missing Firebase service account file: ${serviceAccountPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf-8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
export const FieldValue = admin.firestore.FieldValue;
