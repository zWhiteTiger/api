export class CreateApprovalDto {
    doc_id: string;
    email: string;
    firstName: string;
    lastName: string;
    signature?: string;
    position: number[];
    page: number;
  }