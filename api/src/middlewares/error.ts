import { Request, Response, NextFunction } from 'express'

// Custom error classes to extend Error
export class AppError extends Error {
  status: number
  code: string

  constructor(
    message: string,
    status: number = 500,
    code: string = 'INTERNAL_SERVER_ERROR'
  ) {
    super(message)
    this.name = this.constructor.name
    this.status = status
    this.code = code
    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  errors: any[]

  constructor(message: string, errors: any[] = []) {
    super(message, 400, 'VALIDATION_ERROR')
    this.errors = errors
  }
}

export class S3ServiceError extends AppError {
  constructor(message: string) {
    super(message, 502, 'S3_SERVICE_ERROR')
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR')
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error details for debugging
  console.error(`[${new Date().toISOString()}] Error:`, {
    path: req.path,
    method: req.method,
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  })

  // Handle our custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.status).json({
      status: 'error',
      code: err.code,
      message: err.message,
      errors: err instanceof ValidationError ? err.errors : undefined,
      requestId: req.headers['x-request-id'] || undefined,
    })
  }

  // Handle other known error types
  if (err.name === 'SyntaxError') {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_JSON',
      message: 'Invalid JSON in request body',
    })
  }

  // Default error response for unhandled errors
  const statusCode = 500
  const responseBody = {
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message:
      process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : err.message || 'Internal server error',
    requestId: req.headers['x-request-id'] || undefined,
  }

  res.status(statusCode).json(responseBody)
}
