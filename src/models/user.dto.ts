import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

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

export class UpdateUserDto {

  @IsOptional()
  bio: string;
  @IsOptional()
  image: string;
}
