import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();

  const serviceAccount = JSON.parse(process.env.FIRE_CONNECT);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  const app = await NestFactory.create(AppModule, { cors: true });
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
