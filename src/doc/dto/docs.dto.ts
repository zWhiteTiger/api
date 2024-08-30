import { IsNotEmpty, isNotEmpty, IsOptional, IsString } from "class-validator";

export class DocsDto {
    @IsString()
    @IsNotEmpty()
    doc_name: string;

    @IsString()
    @IsOptional()
    user_id: string;

}