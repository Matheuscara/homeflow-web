import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, switchMap } from 'rxjs';
import { ApiService } from './api.service';
import { UserService, UserWithFamily } from './user.service';
import { CreateFamilyDto, Family, JoinFamilyDto } from '../models/family.model';

@Injectable({
  providedIn: 'root'
})
export class FamilyService {
  private api = inject(ApiService);
  private userService = inject(UserService);

  // Computed signal that gets family from user data
  currentFamily = computed(() => this.userService.currentUserData()?.family || null);

  getMyFamily(): Observable<Family> {
    return this.api.get<Family>('/families/my-family');
  }

  createFamily(data: CreateFamilyDto): Observable<UserWithFamily> {
    return this.api.post<Family>('/families', data).pipe(
      switchMap(() => this.userService.getMe())
    );
  }

  joinFamily(data: JoinFamilyDto): Observable<UserWithFamily> {
    return this.api.post<Family>('/families/join', data).pipe(
      switchMap(() => this.userService.getMe())
    );
  }

  getFamily(id: string): Observable<Family> {
    return this.api.get<Family>(`/families/${id}`);
  }

  leaveFamily(): Observable<UserWithFamily> {
    return this.api.post<void>('/families/leave', {}).pipe(
      switchMap(() => this.userService.getMe())
    );
  }
}
