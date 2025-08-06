import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT || 3000
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser());
   
  const config = new DocumentBuilder()
    .setTitle('URL Shortener API')
    .setDescription('JWT bilan himoyalangan URL qisqartirish API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, ()=>{
    console.log(`Server is running ${PORT}`);
    
  });
}
bootstrap();