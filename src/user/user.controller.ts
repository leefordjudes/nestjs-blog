import { Controller, Get, UseGuards, Put, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { UserDecorator } from './../auth/user.decorator';
import { User } from './../models/user.model';
import { UpdateUserDto } from 'src/models/user.dto';
import { Transform } from 'class-transformer';

@Controller('user')
export class UserController {

  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(@UserDecorator() {username}: User) {
    return await this.userService.findByUsername(username);
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(@UserDecorator() {username}: User, @Body(new ValidationPipe({transform: true, whitelist: true})) data: UpdateUserDto) {
    return await this.userService.updateUser(username, data);
  }
}
