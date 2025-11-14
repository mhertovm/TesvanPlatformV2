import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
// import * as express from 'express';
// import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //   // Make upload folder static
  // app.use('/upload', express.static(join(process.cwd(), 'upload')));

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // Activate the filter for the entire program
  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Tesvan API')
    .setDescription('Tesvan platform API description')
    .setVersion('2.0')
    .addServer('http://localhost:3000', 'local development server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, just to clarify the token type
      },
      'access-token', // This name is used to reference the bearer token in Swagger
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // Optional, just to clarify the token type
      },
      'refresh-token', // This name is used to reference the bearer token in Swagger
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
