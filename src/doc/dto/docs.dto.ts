import { IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class DocsDto {
    @IsString()
    @IsNotEmpty()
    doc_name: string;

    @IsString()
    @IsOptional()
    user_id: string;

    @IsString()
    @IsOptional()
    isPublic: string

    @IsString()
    @IsOptional()
    isStatus: string

    @IsNumber()
    @IsOptional()
    currentPriority: number

}
