import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('bootstap');
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');

  // enable cors in development
  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else if (process.env.NODE_ENV === 'production') {
    app.enableCors({ origin: serverConfig.origin });
    logger.log(`Accepting request from origin: ${serverConfig.origin}`);
  }

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`Server listening on port ${port}`);
}
bootstrap();
