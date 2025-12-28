import { BookModel } from "../models/book.model.js";
import { AuthorModel } from "../models/author.model.js";

export const BooksController = {
  async list(req, res, next) {
    try {
      const { page, limit, q, available } = req.query;
      const result = await BookModel.list({ page, limit, q, available });
      res.json(result);
    } catch (e) {
      next(e);
    }
  },

  async get(req, res, next) {
    try {
      const book = await BookModel.get(req.params.id);
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      if (req.body.author) {
        const createdAuthor = await AuthorModel.create(req.body.author);
        req.body.author_id = createdAuthor.id;
        delete req.body.author;
      }

      const author = await AuthorModel.get(req.body.author_id);
      if (!author) return res.status(400).json({ message: "author_id invalid" });

      const book = await BookModel.create(req.body);
      res.status(201).json(book);
    } catch (e) {
      const status = e.status || 500;



      res.status(status).json({ message: e.message || "Error" });
    }
  },

  async update(req, res, next) {
    try {
      if (req.body.author_id) {
        const author = await AuthorModel.get(req.body.author_id);
        if (!author) return res.status(400).json({ message: "author_id invalid" });
      }

      const book = await BookModel.update(req.params.id, req.body);
      if (!book) return res.status(404).json({ message: "Book not found" });
      res.json(book);
    } catch (e) {
      const status = e.status || 500;
      res.status(status).json({ message: e.message || "Error" });
    }
  },

  async remove(req, res, next) {
    try {
      const ok = await BookModel.remove(req.params.id);
      if (!ok) return res.status(404).json({ message: "Book not found" });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
};
