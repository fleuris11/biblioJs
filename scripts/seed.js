import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { db, FieldValue } from "../models/db.js";

dotenv.config();

const rounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

async function ensureEmpty(collectionName) {
  const snap = await db.collection(collectionName).limit(1).get();
  return snap.empty;
}

async function seed() {
  try {
    // Authors
    const authorsEmpty = await ensureEmpty("authors");

    const authors = [
      { id: uuid(), name: "Victor Hugo", birth_year: 1802, nationality: "Française", biography: "Romancier et poète français." },
      { id: uuid(), name: "Jane Austen", birth_year: 1775, nationality: "Anglaise", biography: "Romancière anglaise, connue pour ses romans de mœurs." },
      { id: uuid(), name: "Gabriel García Márquez", birth_year: 1927, nationality: "Colombienne", biography: "Écrivain colombien, prix Nobel de littérature." },
    ];

    if (authorsEmpty) {
      const batch = db.batch();
      authors.forEach((a) => {
        const ref = db.collection("authors").doc(a.id);
        batch.set(ref, { ...a, created_at: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp() });
      });
      await batch.commit();
      console.log(`Inserted ${authors.length} authors`);
    } else {
      console.log("Authors collection not empty — skipping authors insertion.");
    }

    // Books
    const booksEmpty = await ensureEmpty("books");

    const books = [
      {
        id: uuid(),
        title: "Les Misérables",
        author_id: authors[0].id,
        isbn: "9780140444308",
        published_year: 1862,
        pages: 1463,
        description: "Roman historique et social.",
        available: true,
      },
      {
        id: uuid(),
        title: "Pride and Prejudice",
        author_id: authors[1].id,
        isbn: "9780141439518",
        published_year: 1813,
        pages: 279,
        description: "Roman d'analyse sociale.",
        available: true,
      },
      {
        id: uuid(),
        title: "Cien Años de Soledad",
        author_id: authors[2].id,
        isbn: "9780307474728",
        published_year: 1967,
        pages: 417,
        description: "Roman magique et familial.",
        available: true,
      },
    ];

    if (booksEmpty) {
      const batch = db.batch();
      books.forEach((b) => {
        const ref = db.collection("books").doc(b.id);
        batch.set(ref, { ...b, created_at: FieldValue.serverTimestamp(), updated_at: FieldValue.serverTimestamp() });
      });
      await batch.commit();
      console.log(`Inserted ${books.length} books`);
    } else {
      console.log("Books collection not empty — skipping books insertion.");
    }

    // Users
    const usersEmpty = await ensureEmpty("users");

    const users = [
      { id: uuid(), email: "admin@example.com", password: "adminpass" },
      { id: uuid(), email: "user@example.com", password: "userpass" },
    ];

    if (usersEmpty) {
      const batch = db.batch();
      for (const u of users) {
        const hash = await bcrypt.hash(u.password, rounds);
        const ref = db.collection("users").doc(u.id);
        batch.set(ref, { id: u.id, email: u.email, password: hash, created_at: FieldValue.serverTimestamp() });
      }
      await batch.commit();
      console.log(`Inserted ${users.length} users (passwords hashed)`);
    } else {
      console.log("Users collection not empty — skipping users insertion.");
    }

    console.log("Seeding finished.");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
