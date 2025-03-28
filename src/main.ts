import './shared/utils/global-setup';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors({
    origin: 'http://localhost:3000', // React dev server
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 5000);
}
void bootstrap();
