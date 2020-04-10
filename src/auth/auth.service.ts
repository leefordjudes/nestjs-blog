import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './../models/user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto } from './../models/user.dto';
import * as _ from 'lodash';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ){}

  async register(credentials: RegisterDto) {
    try {
      credentials.password = await bcrypt.hash(credentials.password, 10);
      const user = await this.userModel.create(credentials);
      // const payload = {username: user.username};
      // const token = this.jwtService.sign(payload);
      // return {user: {...user.toJSON(), token}};
      return user;
    } catch (err) {
      if(err.code === 11000) {
        throw new ConflictException(Object.keys(err.keyPattern)[0]+' has already been taken');
      }
      throw new InternalServerErrorException(err);
    }
  }

  async login({email, password}: LoginDto) {

    try {
      const user = await this.userModel.findOne({email});
      if(user && await bcrypt.compare(password, user.password)) {
        const result = _.assign({}, _.pick(user, ['id','email','username','bio','image']))
        // const payload = {username: result.username};
        // const token = this.jwtService.sign(payload);
        // return {user: {...result.toJSON(), token}};
        return result;
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (err) {
      return err.response;
    }
  }

}
