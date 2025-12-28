import { db, FieldValue } from "./db.js";
import { v4 as uuid } from "uuid";

const col = db.collection("books");

export const BookModel = {
  async list({ page = 1, limit = 10, q, available }) {
    page = Number(page);
    limit = Number(limit);

    // Simple pagination by offset
    let query = col;

    if (available !== undefined) {
      const boolVal = available === "true" || available === true;
      query = query.where("available", "==", boolVal);
    }

    // Simple search fallback: filter titles on the app side
    const totalSnap = await query.get();
    const total = totalSnap.size;

    const snap = await query
      .orderBy("created_at", "desc")
      .offset((page - 1) * limit)
      .limit(limit)
      .get();

    let data = snap.docs.map((d) => d.data());

    if (q) {
      const needle = String(q).toLowerCase();
      data = data.filter((b) => (b.title || "").toLowerCase().includes(needle));
    }

    return { page, limit, total, data };
  },

  async get(id) {
    const doc = await col.doc(id).get();
    return doc.exists ? doc.data() : null;
  },

  async create(payload) {
    // ISBN unique check
    const existing = await col.where("isbn", "==", payload.isbn).limit(1).get();
    if (!existing.empty) {
      const err = new Error("ISBN already exists");
      err.status = 409;
      throw err;
    }

    const id = uuid();
    const book = {
      id,
      ...payload,
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    };
    await col.doc(id).set(book);
    return book;
  },

  async update(id, payload) {
    const docRef = col.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return null;

    // si isbn changé, vérifier unicité
    if (payload.isbn) {
      const existing = await col.where("isbn", "==", payload.isbn).limit(1).get();
      if (!existing.empty) {
        const anyOther = existing.docs.some((d) => d.id !== id);
        if (anyOther) {
          const err = new Error("ISBN already exists");
          err.status = 409;
          throw err;
        }
      }
    }

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
