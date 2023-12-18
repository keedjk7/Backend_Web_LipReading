import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');

  // cookie
  app.use(cookieParser());
  // Enable CORS with the defined options
  app.enableCors({
    // origin:'http://localhost:3000',
    credentials:true
  });
  app.use(bodyParser.json({limit:'50mb'}))
  await app.listen(3000);
}
bootstrap();
