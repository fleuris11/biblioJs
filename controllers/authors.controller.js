import { AuthorModel } from "../models/author.model.js";

export const AuthorsController = {
  async list(req, res, next) {
    try {
      const authors = await AuthorModel.list();
      res.json(authors);
    } catch (e) {
      next(e);
    }
  },

  async get(req, res, next) {
    try {
      const author = await AuthorModel.get(req.params.id);
      if (!author) return res.status(404).json({ message: "Author not found" });
      res.json(author);
    } catch (e) {
      next(e);
    }
  },

  async create(req, res, next) {
    try {
      const author = await AuthorModel.create(req.body);
      res.status(201).json(author);
    } catch (e) {
      next(e);
    }
  },

  async update(req, res, next) {
    try {
      const author = await AuthorModel.update(req.params.id, req.body);
      if (!author) return res.status(404).json({ message: "Author not found" });
      res.json(author);
    } catch (e) {
      next(e);
    }
  },

  async remove(req, res, next) {
    try {
      const ok = await AuthorModel.remove(req.params.id);
      if (!ok) return res.status(404).json({ message: "Author not found" });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  },
};
