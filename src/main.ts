import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import * as process from 'node:process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The Movie Page')
    .setVersion('1.0')
    .addTag('Movies')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
