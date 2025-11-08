import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';
import { HttpStatus } from '../constants/httpStatus';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number = HttpStatus.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  // Required by Express - must have 4 parameters for error handler
  // eslint-disable-next-line no-unused-vars
  _next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const errorMessage = isProduction
    ? 'Internal server error'
    : err.message || 'Internal server error';

  return sendError(res, errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
