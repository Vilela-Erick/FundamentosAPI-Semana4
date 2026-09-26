import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  // 1. Se agrega el instrumento de telemetría que exige el módulo
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // 2. Mantienes tu configuración obligatoria de validaciones
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true, 
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();