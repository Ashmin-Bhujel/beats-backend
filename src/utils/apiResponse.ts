class APIResponse {
  statusCode: number;
  message: string;
  data: Record<string, any> | null;
  success: boolean;

  constructor(
    statusCode: number,
    message: string,
    data: Record<string, any> | null = null
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
      success: this.success,
    };
  }
}

export { APIResponse };
