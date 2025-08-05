import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { successResponse } from "../helpers/response.helper";
import { RESPONSE_MESSAGE_KEY } from "../decorators/response-message.decorator";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const message =
      typeof this.reflector.get === "function"
        ? this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
          ) || "Request successful"
        : "Request successful";

    return next.handle().pipe(
      map((data) => {
        return successResponse(
          data,
          typeof message === "string" ? message : "Request successful",
        );
      }),
    );
  }
}
