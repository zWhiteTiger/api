import { IsNotEmpty, isNotEmpty, IsOptional, IsString } from "class-validator";

export class PublicDocsDto {
    @IsString()
    @IsNotEmpty()
    isPublic: boolean;

    @IsString()
    @IsOptional()
    status: "unread";

    @IsString()
    @IsOptional()
    isProgress: "pending";

    @IsString()
    @IsOptional()
    currentPriority: string

}