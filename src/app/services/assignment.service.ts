import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { TaskAssignment, TaskStatus, UpdateAssignmentDto } from '../models/assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  private api = inject(ApiService);

  todayAssignments = signal<TaskAssignment[]>([]);

  getTodayAssignments(): Observable<TaskAssignment[]> {
    return this.api.get<TaskAssignment[]>('/assignments/today').pipe(
      tap(assignments => this.todayAssignments.set(assignments))
    );
  }

  getMyAssignments(): Observable<TaskAssignment[]> {
    return this.api.get<TaskAssignment[]>('/assignments/my-assignments');
  }

  updateAssignmentStatus(id: string, status: TaskStatus): Observable<TaskAssignment> {
    const data: UpdateAssignmentDto = { status };
    return this.api.patch<TaskAssignment>(`/assignments/${id}`, data).pipe(
      tap(updatedAssignment => {
        this.todayAssignments.update(assignments =>
          assignments.map(a => a.id === id ? updatedAssignment : a)
        );
      })
    );
  }

  completeAssignment(id: string): Observable<TaskAssignment> {
    return this.updateAssignmentStatus(id, TaskStatus.COMPLETED);
  }

  skipAssignment(id: string): Observable<TaskAssignment> {
    return this.updateAssignmentStatus(id, TaskStatus.SKIPPED);
  }
}
