import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import { ApplicationModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(ApplicationModule, new FastifyAdapter(), { cors: true });
  app.setGlobalPrefix('api');

  // Setup SwaggerModule
  setupSwagger(app);

  // Enabling DI for class-validator
  useContainer(app.select(ApplicationModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
