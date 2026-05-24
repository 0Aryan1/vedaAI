import mongoose from "mongoose";
import type { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      ...new ApiResponse(error.statusCode, error.message, null),
      success: false,
      errors: error.errors,
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      ...new ApiResponse(400, "Validation failed", null),
      success: false,
      errors: error.errors,
    });
  }

  if (error instanceof mongoose.Error.CastError) {
    return res.status(404).json({
      ...new ApiResponse(404, "Resource not found", null),
      success: false,
    });
  }

  console.error(error);

  return res.status(500).json({
    ...new ApiResponse(500, "Internal server error", null),
    success: false,
  });
};
