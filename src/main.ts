import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

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

  // 3. Interceptor global para serialización (oculta passwords marcados con @Exclude)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();