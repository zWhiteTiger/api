// src/users/dto/update-user.dto.ts

import { IsString, IsOptional, IsIn } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsIn(['student', 'counselor', 'head_of_student_affairs', 'vice_dean', 'dean', 'admin'])
    role?: 'student' | 'counselor' | 'head_of_student_affairs' | 'vice_dean' | 'dean' | 'admin';

    @IsOptional()
    @IsIn(['CE', 'LE', 'IEA', 'ME', 'IDA', 'AME'])
    department?: 'CE' | 'LE' | 'IEA' | 'ME' | 'IDA' | 'AME';

}
