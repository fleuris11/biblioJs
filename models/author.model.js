import { db, FieldValue } from "./db.js";
import { v4 as uuid } from "uuid";

const col = db.collection("authors");

export const AuthorModel = {
  async list() {
    const snap = await col.orderBy("created_at", "desc").get();
    return snap.docs.map((d) => d.data());
  },

  async get(id) {
    const doc = await col.doc(id).get();
    return doc.exists ? doc.data() : null;
  },

  async create(payload) {
    const id = uuid();
    const author = {
      id,
      ...payload,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };
    await col.doc(id).set(author);
    return author;
  },

  async update(id, payload) {//mise à jour
    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;

    await docRef.update({
      ...payload,
      updated_at: FieldValue.serverTimestamp(),
    });

    const updated = await docRef.get();
    return updated.data();
  },

  async remove(id) {
    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return false;
    await docRef.delete();
    return true;
  },
};
