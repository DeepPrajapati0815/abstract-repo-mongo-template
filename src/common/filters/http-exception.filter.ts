import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { errorResponse } from "../helpers/error.helper";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttp = exception instanceof HttpException;
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttp
      ? exception.message || "Unexpected error"
      : "Internal server error";

    const error =
      isHttp && exception.getResponse ? exception.getResponse() : exception;

    const errorPayload = errorResponse({
      statusCode: status,
      message: typeof error === "string" ? error : message,
      error,
      path: request.url,
    });

    response.status(status).json(errorPayload);
  }
}
