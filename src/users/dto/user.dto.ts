import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePassword {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
