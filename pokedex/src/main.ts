import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Prefijos globales (para todas las apis)
  app.setGlobalPrefix('api/v2');
  // Para pipes globales (tomar los DTOs como request)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // solo toma valores del dto en el request (remueve data basura)
      forbidNonWhitelisted: true, // Para que tome como error valores que no estan en el dto
      // transformar los queryParams al objeto requerido
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );
  await app.listen(3000);
}
bootstrap();
