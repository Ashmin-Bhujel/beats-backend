class APIError extends Error {
  statusCode: number;
  data: Record<string, any> | null;
  errors: string[];
  success: boolean;

  constructor(
    statusCode: number,
    message: string = "Something went wrong",
    data: Record<string, any> | null = null,
    errors: string[] = []
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.data = data;
    this.errors = errors;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      errors: this.errors,
      success: this.success,
    };
  }
}

export { APIError };
