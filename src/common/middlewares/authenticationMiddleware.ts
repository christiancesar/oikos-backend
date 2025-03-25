import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "@common/errors/AppError";

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

/**
 * Middleware to authenticate requests using JWT tokens.
 *
 * @param request - The incoming request object.
 * @param response - The outgoing response object.
 * @param next - The next middleware function in the stack.
 * @throws {AppError} If the JWT token is missing or invalid.
 *
 * This middleware checks for the presence of an authorization header in the request.
 * If the header is missing or the token is invalid, it throws an `AppError`.
 * If the token is valid, it decodes the token and attaches the user ID to the request object.
 */

export default function authenticationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new AppError("JWT token is missing", 401);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, token] = authHeader.split(" ");
  try {
    if (process.env.JWT_SECRET === undefined) {
      throw new AppError("Setup error: JWT secret is not defined", 500);
    }

    if (!token) {
      throw new AppError("JWT token is missing", 401);
    }

    const decoded = verify(token, process.env.JWT_SECRET);

    const { sub } = decoded as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new AppError("Invalid JWT token", 401);
  }
}
