import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UserSchema } from './../models/user.model';
import { ConfigModule } from './../shared/config/config.module';
import { ConfigService } from './../shared/config/config.service';
import { JwtStrategy } from './jwt.strategy';


@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{name:'User', schema: UserSchema}], 'blog'),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET'),
        signOptions: {
          expiresIn: 3600,
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}
