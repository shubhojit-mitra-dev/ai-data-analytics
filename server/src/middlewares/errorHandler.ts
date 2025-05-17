import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
  message: string;
  stack?: string;
  status?: number;
}

export const errorHandler = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  
  const errorResponse: ErrorResponse = {
    message: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  };

  console.error(`[ERROR] ${err.message}`);
  res.status(statusCode).json(errorResponse);
};