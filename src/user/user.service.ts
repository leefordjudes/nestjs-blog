import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './../models/user.model';
import * as _ from 'lodash';
import { UpdateUserDto } from './../models/user.dto';
import { SharedService } from './../shared/shared.service';

@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly sharedService: SharedService,
  ){}

  async findByUsername(username: string, user?: User) {
    const resultUser = await this.userModel.findOne({username});
    let isFollowed: boolean | null;
    if(user) {
      isFollowed = resultUser.followers.includes(user.id);
    }
    if(resultUser) {
      // return _.pick(resultUser, ['id','email','username','bio','image','createdAt','updatedAt']);
      return await this.sharedService.toProfile(resultUser, isFollowed);
    } 
    throw new NotFoundException('user not found');
  }

  // async updateUser(username: string, data: UpdateUserDto) {
  //   await this.userModel.updateOne({username}, data);
  //   return this.findByUsername(username);
  // }

  async followUser(currentUser: User, username: string) {
    const user = await this.userModel.findOne({username});
    let isFollowed = user.followers.includes(currentUser.id);
    if(!isFollowed) {
      user.followers.push(currentUser.id);
      await user.save();
      isFollowed = true;
    }
    return this.sharedService.toProfile(currentUser, isFollowed);
  }

  async unfollowUser(currentUser: User, username: string) {
    const user = await this.userModel.findOne({username});
    const index = user.followers.indexOf(currentUser.id); 
    let isFollowed = (index !== -1) ? true : false;
    if(isFollowed) {
      user.followers.splice(index,1);
      await user.save();
      isFollowed = false;
    }
    return await this.sharedService.toProfile(currentUser, isFollowed);
  }

 

}
