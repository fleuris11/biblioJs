import { Router } from "express";
import { BooksController } from "../controllers/books.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { bookCreateSchema, bookUpdateSchema } from "../schemas/book.schema.js";

const router = Router();

router.get("/", BooksController.list);
router.get("/:id", BooksController.get);
router.post("/", requireAuth, validate(bookCreateSchema), BooksController.create);
router.put("/:id", requireAuth, validate(bookUpdateSchema), BooksController.update);
router.delete("/:id", requireAuth, BooksController.remove);

export default router;
