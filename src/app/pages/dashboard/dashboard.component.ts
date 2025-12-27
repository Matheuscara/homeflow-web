import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AssignmentService } from '../../services/assignment.service';
import { AuthService } from '../../services/auth.service';
import { FamilyService } from '../../services/family.service';
import { UserService } from '../../services/user.service';
import { TaskAssignment, TaskStatus } from '../../models/assignment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">HomeFlow</h1>
              @if (userService.currentUserData(); as userData) {
                @if (userData.family; as family) {
                  <p class="text-sm text-gray-600">{{ family.name }} ({{ family.users.length }} membros)</p>
                } @else {
                  <p class="text-sm text-gray-600">Sem família</p>
                }
              }
            </div>
            <div class="flex items-center gap-4">
              @if (userService.currentUserData(); as userData) {
                <span class="text-sm text-gray-700">{{ userData.name }} ({{ userData.email }})</span>
              }
              <button
                (click)="logout()"
                class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Navigation -->
      <nav class="bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex gap-8">
            <a
              routerLink="/dashboard"
              routerLinkActive="border-indigo-600 text-indigo-600"
              class="px-1 py-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm transition"
            >
              Hoje
            </a>
            <a
              routerLink="/tasks"
              routerLinkActive="border-indigo-600 text-indigo-600"
              class="px-1 py-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm transition"
            >
              Tarefas
            </a>
            <a
              routerLink="/family"
              routerLinkActive="border-indigo-600 text-indigo-600"
              class="px-1 py-4 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm transition"
            >
              Família
            </a>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="mb-6">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Tarefas de Hoje</h2>
          <p class="text-gray-600">{{ today | date: 'EEEE, d MMMM yyyy' }}</p>
        </div>

        @if (loading()) {
          <div class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="text-gray-600 mt-4">Carregando tarefas...</p>
          </div>
        } @else {
          <div class="grid gap-4">
            @if (assignments().length === 0) {
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhuma tarefa para hoje</h3>
                <p class="mt-2 text-sm text-gray-600">Você está livre! Aproveite seu dia.</p>
                <a
                  routerLink="/tasks"
                  class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Gerenciar Tarefas
                </a>
              </div>
            } @else {
              @for (assignment of assignments(); track assignment.id) {
                <div
                  class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition"
                  [class.opacity-50]="assignment.status === 'COMPLETED' || assignment.status === 'SKIPPED'"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">
                          {{ assignment.task.title }}
                        </h3>
                        @if (assignment.isRollover) {
                          <span class="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                            Pendente do dia anterior
                          </span>
                        }
                      </div>

                      @if (assignment.task.description) {
                        <p class="text-gray-600 mb-3">{{ assignment.task.description }}</p>
                      }

                      <div class="flex items-center gap-4 text-sm text-gray-500">
                        <span class="flex items-center gap-1">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          {{ assignment.user.name }}
                        </span>

                        @if (assignment.completedAt) {
                          <span class="flex items-center gap-1 text-green-600">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Concluída às {{ assignment.completedAt | date: 'HH:mm' }}
                          </span>
                        }
                      </div>
                    </div>

                    <div class="flex items-center gap-2 ml-4">
                      @if (assignment.status === 'PENDING') {
                        <button
                          (click)="completeAssignment(assignment)"
                          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm"
                        >
                          Concluir
                        </button>
                        <button
                          (click)="skipAssignment(assignment)"
                          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
                        >
                          Pular
                        </button>
                      } @else if (assignment.status === 'COMPLETED') {
                        <span class="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium text-sm">
                          ✓ Concluída
                        </span>
                      } @else if (assignment.status === 'SKIPPED') {
                        <span class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm">
                          Pulada
                        </span>
                      }
                    </div>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Summary Stats -->
          @if (assignments().length > 0) {
            <div class="mt-8 grid grid-cols-3 gap-4">
              <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
                <div class="text-3xl font-bold text-gray-900">{{ assignments().length }}</div>
                <div class="text-sm text-gray-600 mt-1">Total</div>
              </div>
              <div class="bg-green-50 rounded-xl shadow-sm border border-green-200 p-6 text-center">
                <div class="text-3xl font-bold text-green-700">{{ completedCount() }}</div>
                <div class="text-sm text-green-600 mt-1">Concluídas</div>
              </div>
              <div class="bg-orange-50 rounded-xl shadow-sm border border-orange-200 p-6 text-center">
                <div class="text-3xl font-bold text-orange-700">{{ pendingCount() }}</div>
                <div class="text-sm text-orange-600 mt-1">Pendentes</div>
              </div>
            </div>
          }
        }
      </main>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  assignmentService = inject(AssignmentService);
  authService = inject(AuthService);
  familyService = inject(FamilyService);
  userService = inject(UserService);
  private router = inject(Router);

  assignments = this.assignmentService.todayAssignments;
  loading = signal(true);
  today = new Date();

  completedCount = signal(0);
  pendingCount = signal(0);

  ngOnInit(): void {
    this.loadAssignments();
    // Family data is already loaded via /users/me in AuthService
    // No need to call loadFamily() separately
  }

  loadAssignments(): void {
    this.loading.set(true);
    this.assignmentService.getTodayAssignments().subscribe({
      next: (assignments) => {
        this.updateStats(assignments);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  completeAssignment(assignment: TaskAssignment): void {
    this.assignmentService.completeAssignment(assignment.id).subscribe({
      next: () => {
        this.updateStats(this.assignments());
      }
    });
  }

  skipAssignment(assignment: TaskAssignment): void {
    this.assignmentService.skipAssignment(assignment.id).subscribe({
      next: () => {
        this.updateStats(this.assignments());
      }
    });
  }

  updateStats(assignments: TaskAssignment[]): void {
    this.completedCount.set(
      assignments.filter(a => a.status === TaskStatus.COMPLETED).length
    );
    this.pendingCount.set(
      assignments.filter(a => a.status === TaskStatus.PENDING).length
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
