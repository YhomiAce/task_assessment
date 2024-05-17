import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ResponseInterceptor } from './config/interceptors';
import { DBExceptionFilter, HttpExceptionFilter } from './config/exceptions';
import { initSwagger } from './docs/swagger';

let app: NestApplication;
async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      enableDebugMessages: true,
      skipMissingProperties: false,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );
  app.useGlobalFilters(new HttpExceptionFilter(), new DBExceptionFilter());
  initSwagger(app);
  await app.listen(3000);
}
bootstrap();

export { app };