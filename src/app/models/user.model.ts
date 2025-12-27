export interface User {
  id: string;
  email: string;
  name: string;
  birthDate: string;
  familyId: string | null;
  createdAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  birthDate: string;
  familyName?: string;
  inviteCode?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}
