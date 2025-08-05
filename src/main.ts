import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AllExceptionsFilter } from "./common/filters/http-exception.filter";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AllExceptionsFilter());
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
