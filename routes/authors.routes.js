import { Router } from "express";
import { AuthorsController } from "../controllers/authors.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { authorCreateSchema, authorUpdateSchema } from "../schemas/author.schema.js";

const router = Router();

router.get("/", AuthorsController.list);
router.get("/:id", AuthorsController.get);
router.post("/", requireAuth, validate(authorCreateSchema), AuthorsController.create);
router.put("/:id", requireAuth, validate(authorUpdateSchema), AuthorsController.update);
router.delete("/:id", requireAuth, AuthorsController.remove);

export default router;
