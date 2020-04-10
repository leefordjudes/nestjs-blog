import { Controller, Post, Body, ValidationPipe, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './../models/user.dto';

@Controller('users')
export class AuthController {

  constructor(private authService: AuthService){}

  @Post('/register')

  register(@Body(ValidationPipe) credentials: RegisterDto) {
    return this.authService.register(credentials);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  login(@Body(ValidationPipe) credentials: LoginDto) {
    return this.authService.login(credentials);
  }


}
