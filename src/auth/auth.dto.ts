import { IsEmail, IsNotEmpty, MinLength } from '@nestjs/class-validator';
import { IntersectionType } from '@nestjs/mapped-types';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class RegisterDto extends IntersectionType(LoginDto) {
  @IsNotEmpty()
  name: string;

  username: string;
}
