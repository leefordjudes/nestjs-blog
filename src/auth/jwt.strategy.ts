import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, AuthPayLoad } from "./../models/user.model";
import { ConfigService } from "./../shared/config/config.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      secretOrKey: config.get('SECRET'),
    });
  }

  async validate(payload: AuthPayLoad) {
    const {username} = payload;
    const user = this.userModel.find({username});
    if(!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}