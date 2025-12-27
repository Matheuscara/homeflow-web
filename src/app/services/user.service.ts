import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { User } from '../models/user.model';
import { Family } from '../models/family.model';

export interface UserWithFamily extends User {
  family: Family | null;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private api = inject(ApiService);

  currentUserData = signal<UserWithFamily | null>(null);

  getMe(): Observable<UserWithFamily> {
    return this.api.get<UserWithFamily>('/users/me').pipe(
      tap(userData => this.currentUserData.set(userData))
    );
  }
}
