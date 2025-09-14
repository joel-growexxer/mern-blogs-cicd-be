import { Response } from 'express';

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string | string[];
  count?: number;
  message?: string;
}

export class ResponseHandler {
  static success(
    res: Response,
    data: any,
    statusCode: number = 200,
    message?: string
  ): Response {
    const response: ApiResponse = {
      success: true,
      data
    };

    if (message) {
      response.message = message;
    }

    if (Array.isArray(data)) {
      response.count = data.length;
    }

    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    error: string | string[],
    statusCode: number = 500
  ): Response {
    const response: ApiResponse = {
      success: false,
      error
    };

    return res.status(statusCode).json(response);
  }

  static notFound(res: Response, resource: string = 'Resource'): Response {
    return this.error(res, `${resource} not found`, 404);
  }

  static validationError(res: Response, errors: string[]): Response {
    return this.error(res, errors, 400);
  }

  static serverError(res: Response): Response {
    return this.error(res, 'Server Error', 500);
  }
}
