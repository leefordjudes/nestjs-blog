import { Controller, Get, Param, NotFoundException, Post, Delete, UseGuards, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/auth/user.decorator';
import { OptionalAuthGuard } from 'src/auth/optional-auth.gaurd';
import { User } from 'src/models/user.model';

@Controller('profiles')
export class ProfilesController {
  constructor(private userService: UserService){}

  @Get('/:username')
  @UseGuards(new OptionalAuthGuard())
  async findProfile(@Param('username') username: string, @AuthUser() currentUser: User) {
    //console.log(currentUser);
    const profile = await this.userService.findByUsername(username, currentUser);
    if (!profile) {
      throw new NotFoundException();
    }
    return {profile};
  }

  @Post('/:username/follow')
  @HttpCode(200)
  @UseGuards(AuthGuard())
  followUser(@AuthUser() currentUser, @Param('username') username: string) {
    return this.userService.followUser(currentUser,username);
  }
  
  @Delete('/:username/follow')
  @UseGuards(AuthGuard())
  unfollowUser(@AuthUser() currentUser, @Param('username') username: string) {
    return this.userService.unfollowUser(currentUser,username);
  }
}
