import { ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";

export function interceptErrorMiddleware(
  err: Error,
  request: Request,
  response: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  if (err instanceof AppError) {
    response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err instanceof ZodError) {
    response.status(400).json({
      status: "error",
      message: "Validation error.",
      issues: err.format(),
    });
  }

  console.error(err);

  response.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
