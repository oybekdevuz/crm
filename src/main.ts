import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: "https://moliyaviytahlil.uz/" });
  const config = app.get(ConfigService)
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())

  const swagger = new DocumentBuilder()
    .setTitle('CRM')
    .setDescription('REST API Documentation')
    .setVersion('1.0.0')
    .addTag('Nestjs, postgreSQL, typeORM')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('/api/docs', app, document);
  const port = config.get<number>("API_PORT")
  await app.listen(port, () => {
    console.log(+port);
  });
}
bootstrap();
