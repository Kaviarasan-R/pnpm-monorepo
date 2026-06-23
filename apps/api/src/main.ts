import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const SWAGGER_CDN = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.30.2';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  });

  const config = new DocumentBuilder()
    .setTitle('Boilerplate API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },

    customCssUrl: [`${SWAGGER_CDN}/swagger-ui.css`],
    customJs: [
      `${SWAGGER_CDN}/swagger-ui-bundle.js`,
      `${SWAGGER_CDN}/swagger-ui-standalone-preset.js`,
    ],
  });

  app.getHttpAdapter().get('/api/json', (req, res) => {
    res.type('application/json');
    res.send(document);
  });

  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  await app.listen(process.env.API_PORT ?? 8080);
}

bootstrap()
  .then(() => {
    console.log('API is running!');
  })
  .catch((err) => {
    console.log('Unable to connect to the api', err);
  });
