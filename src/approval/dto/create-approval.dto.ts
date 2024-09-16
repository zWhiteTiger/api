export class CreateApprovalDto {
    readonly doc_id: string;
    readonly email: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly signature?: string; // Optional initially
    readonly position?: number[];
    readonly page?: number
}