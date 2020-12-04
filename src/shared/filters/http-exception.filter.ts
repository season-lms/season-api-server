import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

class BadRequestResponse {
  readonly statusCode: number;
  readonly message: string[];
  readonly error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    let message = null;
    switch (status) {
      case 400:
        const badRequestResponse = exception.getResponse();
        message = (badRequestResponse as BadRequestResponse).message;
        break;
    }

    if (message === null) {
      message = exception.message;
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: exception.message,
    };

    Logger.error(
      `${request.method} ${request.url} ${message}`,
      exception.stack,
      HttpExceptionFilter.name,
    );

    response.status(status).json(errorResponse);
  }
}
