import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));

  const PORT = configService.get('PORT');
  await app.listen(PORT);
}
bootstrap();
