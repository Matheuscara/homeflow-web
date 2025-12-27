import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { CreateTaskDto, Task, UpdateTaskDto } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private api = inject(ApiService);

  tasks = signal<Task[]>([]);

  getTasks(): Observable<Task[]> {
    return this.api.get<Task[]>('/tasks').pipe(
      tap(tasks => this.tasks.set(tasks))
    );
  }

  getTask(id: string): Observable<Task> {
    return this.api.get<Task>(`/tasks/${id}`);
  }

  createTask(data: CreateTaskDto): Observable<Task> {
    return this.api.post<Task>('/tasks', data).pipe(
      tap(newTask => this.tasks.update(tasks => [...tasks, newTask]))
    );
  }

  updateTask(id: string, data: UpdateTaskDto): Observable<Task> {
    return this.api.patch<Task>(`/tasks/${id}`, data).pipe(
      tap(updatedTask => {
        this.tasks.update(tasks =>
          tasks.map(t => t.id === id ? updatedTask : t)
        );
      })
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.api.delete<void>(`/tasks/${id}`).pipe(
      tap(() => {
        this.tasks.update(tasks => tasks.filter(t => t.id !== id));
      })
    );
  }
}
