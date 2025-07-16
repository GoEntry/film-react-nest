import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { LoggerFactory } from './logger/logger.factory';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Выбираем логгер на основе переменной окружения
  const loggerType = process.env.LOGGER_TYPE || 'dev';
  app.useLogger(LoggerFactory.createLogger(loggerType));

  // Уберем префикс
  // app.setGlobalPrefix("api/afisha");
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
