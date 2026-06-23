import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
}

bootstrap()
  .then(() => {
    console.log('Worker is running!');
  })
  .catch((err) => {
    console.log('Unable to connect to the worker', err);
  });
