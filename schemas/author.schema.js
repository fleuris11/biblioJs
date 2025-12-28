import Joi from "joi";

export const authorCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  birth_year: Joi.number().min(0).max(2100).optional(),
  nationality: Joi.string().max(100).optional(),
  biography: Joi.string().allow("").optional(),
});

export const authorUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  birth_year: Joi.number().min(0).max(2100).optional(),
  nationality: Joi.string().max(100).optional(),
  biography: Joi.string().allow("").optional(),
}).min(1);
