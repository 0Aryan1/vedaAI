import type { RequestHandler } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: ZodSchema): RequestHandler =>
  (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      console.error('Zod Validation Error:', JSON.stringify(result.error.issues, null, 2));
      throw new ApiError(400, "Validation failed", result.error.flatten());
    }

    req.body = result.data;
    next();
  };
