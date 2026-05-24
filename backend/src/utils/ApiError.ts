export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown;
  public readonly success = false;

  constructor(statusCode: number, message: string, errors?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
