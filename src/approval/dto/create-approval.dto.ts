export class CreateApprovalDto {
  doc_id: string;
  position: Position[];
  page: number;
  email: string;
}

type Position = {
  x: number,
  y: number
}