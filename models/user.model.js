import { db, FieldValue } from "./db.js";
import { v4 as uuid } from "uuid";

const col = db.collection("users");

export const UserModel = {

  async findByEmail(email) {
    const snap = await col.where("email", "==", email).limit(1).get();
    if (snap.empty) return null;
    return snap.docs[0].data();
  },

  async create({ email, password_hash }) {
    const id = uuid();
    const user = {
      id,
      email,
      
      password: password_hash,
      created_at: FieldValue.serverTimestamp(),
    };
    await col.doc(id).set(user);
    return user;
  },
};
