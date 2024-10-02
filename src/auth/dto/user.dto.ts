import { IsString, IsEmail, IsDate, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

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

  @Type(() => Date)  // ใช้ class-transformer เพื่อแปลงค่าเป็น Date
  @IsDate()
  birthDate: Date;

  @IsEnum(['male', 'female', 'nonBinary'])
  gender: string;
}