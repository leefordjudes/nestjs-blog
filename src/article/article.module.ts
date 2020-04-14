import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { articleSchema } from './../models/article.model';
import { UserSchema } from './../models/user.model';
import { AuthModule } from './../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{name:'Article', schema: articleSchema}], 'blog'),
    MongooseModule.forFeature([{name:'User', schema: UserSchema}], 'blog'),
  ],
  providers: [ArticleService],
  controllers: [ArticleController]
})
export class ArticleModule {}
