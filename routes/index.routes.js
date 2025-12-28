import { Router } from "express";
import authRoutes from "./auth.routes.js";
import authorsRoutes from "./authors.routes.js";
import booksRoutes from "./books.routes.js";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/authors", authorsRoutes);
router.use("/api/books", booksRoutes);

export default router;
