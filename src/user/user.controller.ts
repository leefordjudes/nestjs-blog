import { Controller, Get, UseGuards, Put, Body, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { AuthUser } from './../auth/user.decorator';
import { User } from './../models/user.model';
import { UpdateUserDto } from 'src/models/user.dto';
import { Transform } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {

  constructor(private userService: UserService, private authService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard())
  async findCurrentUser(@AuthUser() {username}: User) {
    return await this.authService.findCurrentUser(username);
    //return await this.userService.findByUsername(username);
  }

  @Put()
  @UseGuards(AuthGuard())
  async update(@AuthUser() {username}: User, @Body(new ValidationPipe({transform: true, whitelist: true})) data: UpdateUserDto) {
    return await this.authService.updateUser(username, data);
    //return await this.userService.updateUser(username, data);
  }
}
