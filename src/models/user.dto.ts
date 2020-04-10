import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsString()
  @MinLength(5)
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string; 
}
