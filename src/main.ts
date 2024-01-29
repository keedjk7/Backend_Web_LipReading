import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.setGlobalPrefix('api');

  // Enable CORS with the defined options
  app.enableCors({
    origin: ['http://161.246.5.159:7777', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials:true
  });
  // cookie
  app.use(cookieParser());
  app.use(bodyParser.json({limit:'500mb'}))
  await app.listen(3000);
}
bootstrap();
