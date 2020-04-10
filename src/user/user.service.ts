import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './../models/user.model';
import * as _ from 'lodash';
import { UpdateUserDto } from './../models/user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ){}

  async findByUsername(username: string) {
    const user = await this.userModel.findOne({username});
    if(user) {
      return _.pick(user, ['id','email','username','bio','image','createdAt','updatedAt']);
    } 
    return null;
  }

  async updateUser(username: string, data: UpdateUserDto) {
    await this.userModel.updateOne({username}, data);
    return this.findByUsername(username);
  }

}
