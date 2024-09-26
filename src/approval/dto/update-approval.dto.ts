export class UpdateApprovalDto {
  page?: number;
  position?: Position[];  // Array of coordinates
  email?: string;   // Update the user email
  firstName?: string;  // Update the user's first name
  lastName?: string;   // Update the user's last name
  signature?: string;  // Update the user's signature (URL or base64 string)
}

type Position = {
  x: number,
  y: number
}