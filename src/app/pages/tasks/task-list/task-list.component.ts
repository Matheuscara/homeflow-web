import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { Task } from '../../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">Gerenciar Tarefas</h1>
            <div class="flex items-center gap-4">
              <a
                routerLink="/tasks/create"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
              >
                + Nova Tarefa
              </a>
              <span class="text-sm text-gray-700">{{ authService.currentUser()?.name }}</span>
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
        @if (loading()) {
          <div class="text-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p class="text-gray-600 mt-4">Carregando tarefas...</p>
          </div>
        } @else {
          @if (tasks().length === 0) {
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Nenhuma tarefa cadastrada</h3>
              <p class="mt-2 text-sm text-gray-600">Comece criando sua primeira tarefa para a família.</p>
              <a
                routerLink="/tasks/create"
                class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Criar Tarefa
              </a>
            </div>
          } @else {
            <div class="grid gap-4">
              @for (task of tasks(); track task.id) {
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ task.title }}</h3>

                      @if (task.description) {
                        <p class="text-gray-600 mb-3">{{ task.description }}</p>
                      }

                      <div class="flex items-center gap-4 text-sm">
                        @if (task.isRotation) {
                          <span class="flex items-center gap-1 text-indigo-600">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Rotação entre membros
                          </span>
                        } @else {
                          <span class="flex items-center gap-1 text-gray-500">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Tarefa fixa
                          </span>
                        }

                        <span class="flex items-center gap-1 text-gray-500">
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          A cada {{ task.frequencyDays }} {{ task.frequencyDays === 1 ? 'dia' : 'dias' }}
                        </span>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 ml-4">
                      <a
                        [routerLink]="['/tasks/edit', task.id]"
                        class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium text-sm"
                      >
                        Editar
                      </a>
                      <button
                        (click)="deleteTask(task)"
                        class="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        }
      </main>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  taskService = inject(TaskService);
  authService = inject(AuthService);
  private router = inject(Router);

  tasks = this.taskService.tasks;
  loading = signal(true);

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading.set(true);
    this.taskService.getTasks().subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  deleteTask(task: Task): void {
    if (confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => {
          // Task removed from signal in service
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
