export interface Task {
  id: string;
  title: string;
  description: string | null;
  familyId: string;
  isRotation: boolean;
  frequencyDays: number;
  createdAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  isRotation: boolean;
  frequencyDays: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  isRotation?: boolean;
  frequencyDays?: number;
}
