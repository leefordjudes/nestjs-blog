import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { ProfilesController } from './profiles.controller';
import { UserSchema } from './../models/user.model';
import { AuthModule } from './../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name:'User', schema: UserSchema}], 'blog'),
    AuthModule,
  ],
  providers: [UserService],
  controllers: [UserController, ProfilesController]
})
export class UserModule {}
