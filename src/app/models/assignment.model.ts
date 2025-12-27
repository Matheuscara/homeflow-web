import { Task } from './task.model';
import { User } from './user.model';

export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED'
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  task: Task;
  userId: string;
  user: User;
  scheduledDate: string;
  completedAt: string | null;
  isRollover: boolean;
  status: TaskStatus;
}

export interface UpdateAssignmentDto {
  status: TaskStatus;
}
