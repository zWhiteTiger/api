import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePassword {

  @IsString()
  @MinLength(8, {
    message: 'Password must be at least 6 characters long',
  })
  password: string;
}
