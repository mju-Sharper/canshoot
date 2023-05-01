import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { json, urlencoded } from 'express';

import { AppModule } from './app.module';
import { AuthenticatedSocketIoAdapter } from './common/adapters';
import { LoggerService } from './logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.enableCors();
  app.use(json({ limit: '100mb' }));
  app.use(urlencoded({ extended: true, limit: '100mb' }));
  app.useWebSocketAdapter(new AuthenticatedSocketIoAdapter(app));
  app.useLogger(app.get(LoggerService));
  await app.listen(3000);
}
bootstrap();
