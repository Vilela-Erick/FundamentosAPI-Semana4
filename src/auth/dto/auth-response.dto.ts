export interface SafeUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AuthResponseDto {
  user: SafeUser;
  access_token: string;
}
