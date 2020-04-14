import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './../models/user.model';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { RegisterDto, LoginDto, UpdateUserDto } from './../models/user.dto';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import {classToPlain} from "class-transformer";
import { SharedService } from './../shared/shared.service';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly sharedService: SharedService,
    private jwtService: JwtService
  ){}

  async register(credentials: RegisterDto) {
    try {
      credentials.password = await bcrypt.hash(credentials.password, 10);
      const user = await this.userModel.create(credentials);
      const payload = {username: user.username};
      const token = this.jwtService.sign(payload);
      //return {user: {...classToPlain(user), token}};
      return {user: {...await this.sharedService.toJSON(user), token}};
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
        // _.assign(user, _.pick(user, ['id','email','username','bio','image']))
        const payload = {username: result.username};
        //const payload = {username: user.username};
        const token = this.jwtService.sign(payload);
        return { user: {...await this.sharedService.toJSON(result), token}};
        //return { user: {...classToPlain(result), token}};
        //return { user: {...classToPlain(user), token}};
      }
      throw new UnauthorizedException('Invalid credentials');
    } catch (err) {
      return err.response;
    }
  }

  async findCurrentUser(username: string) {
    const user = await this.userModel.findOne({username});
    const payload = {username: user.username};
    const token = this.jwtService.sign(payload);
    const resultUser = await this.sharedService.toJSON(user);
    delete resultUser.password;
    return { user: {...resultUser, token}};
    // return { user: {...classToPlain(user), token}};
  }

  async updateUser(username: string, data: UpdateUserDto) {
    await this.userModel.updateOne({username}, data);
    const user:any = await this.userModel.findOne({username});
    const payload = {username: user.username};
    const token = this.jwtService.sign(payload);
    const resultUser = await this.sharedService.toJSON(user);
    delete resultUser.password;
    return { user: {...resultUser, token}};
    // return { user: {...classToPlain(user), token}};
  }

}
