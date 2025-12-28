import Joi from "joi";
import { authorCreateSchema } from "./author.schema.js";

export const bookCreateSchema = Joi.object({
  title: Joi.string().max(200).required(),
  // accept either an existing author_id (uuid) or an embedded author object to create
  author_id: Joi.string().uuid().optional(),
  author: authorCreateSchema.optional(),
  isbn: Joi.string().length(13).required(),
  published_year: Joi.number().min(1900).max(2100).required(),
  pages: Joi.number().integer().min(1).required(),
  description: Joi.string().allow("").optional(),
  available: Joi.boolean().default(true),
}).or('author_id', 'author');

export const bookUpdateSchema = Joi.object({
  title: Joi.string().max(200).optional(),
  author_id: Joi.string().uuid().optional(),
  author: authorCreateSchema.optional(),
  isbn: Joi.string().length(13).optional(),
  published_year: Joi.number().min(1900).max(2100).optional(),
  pages: Joi.number().integer().min(1).optional(),
  description: Joi.string().allow("").optional(),
  available: Joi.boolean().optional(),
}).min(1);
