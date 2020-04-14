import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './shared/config/config.service';
//import * as mongoose from 'mongoose';
import { mongo } from 'mongoose';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api');
  await app.listen(config.get('LISTEN_PORT') || 4500);
  /*
  const db = await mongo.connect(`mongodb://127.0.0.1:27017/blog`,{useUnifiedTopology: true});
  const users = await db.db('blog').dropCollection('users') ? 'users collection cleaned':'error in cleaning users collection';
  console.log(db.isConnected?'blog database connected':'error in database connection');
  console.log(users);
  */
}
bootstrap();
