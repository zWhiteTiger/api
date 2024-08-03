import { IsString } from "class-validator";

export class DocsDto {
    @IsString()
    doc_name: string;

    @IsString()
    doc_id: string;

    @IsString()
    user_id: string;
}