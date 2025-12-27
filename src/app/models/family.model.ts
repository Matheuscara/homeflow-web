import { User } from './user.model';

export interface Family {
  id: string;
  name: string;
  inviteCode: string;
  adminId: string;
  users: User[];
  createdAt: string;
}

export interface CreateFamilyDto {
  name: string;
}

export interface JoinFamilyDto {
  inviteCode: string;
}
