import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );
  app.setGlobalPrefix('payments/v1');

  const port = Number(process.env.PAYMENT_PORT || 4001);
  await app.listen(port, '0.0.0.0');
  console.log(`AFRIWORK Payment & Escrow Service listening on http://0.0.0.0:${port}/payments/v1`);
}

bootstrap();
