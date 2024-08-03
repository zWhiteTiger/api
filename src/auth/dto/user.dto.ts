import { IsString, IsEmail, IsDate, IsEnum } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  confirmPassword: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsDate()
  birthDate: Date;

  @IsEnum(['male', 'female', 'nonBinary'])
  gender: string;
}
