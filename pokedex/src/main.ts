import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Prefijos globales (para todas las apis)
  app.setGlobalPrefix('api/v2');
  await app.listen(3000);
}
bootstrap();
