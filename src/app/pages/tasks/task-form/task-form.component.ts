import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../../services/task.service';
import { AuthService } from '../../../services/auth.service';
import { CreateTaskDto, UpdateTaskDto } from '../../../models/task.model';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <a
                routerLink="/tasks"
                class="text-gray-600 hover:text-gray-900"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </a>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ isEditMode() ? 'Editar Tarefa' : 'Nova Tarefa' }}
              </h1>
            </div>
            <span class="text-sm text-gray-700">{{ authService.currentUser()?.name }}</span>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form (ngSubmit)="onSubmit()" #taskForm="ngForm" class="space-y-6">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
                Título da Tarefa *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                [(ngModel)]="formData.title"
                required
                minlength="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="Ex: Lavar a louça"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                [(ngModel)]="formData.description"
                rows="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                placeholder="Descrição opcional da tarefa..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                Tipo de Tarefa
              </label>
              <div class="space-y-3">
                <label class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition"
                       [class.border-indigo-500]="formData.isRotation"
                       [class.bg-indigo-50]="formData.isRotation">
                  <input
                    type="radio"
                    name="isRotation"
                    [value]="true"
                    [(ngModel)]="formData.isRotation"
                    class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div class="ml-3">
                    <span class="block text-sm font-medium text-gray-900">Rotação entre membros</span>
                    <span class="block text-sm text-gray-600">A tarefa será alternada entre os membros da família por ordem de idade</span>
                  </div>
                </label>

                <label class="flex items-start p-4 border-2 rounded-lg cursor-pointer transition"
                       [class.border-indigo-500]="!formData.isRotation"
                       [class.bg-indigo-50]="!formData.isRotation">
                  <input
                    type="radio"
                    name="isRotation"
                    [value]="false"
                    [(ngModel)]="formData.isRotation"
                    class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <div class="ml-3">
                    <span class="block text-sm font-medium text-gray-900">Tarefa fixa</span>
                    <span class="block text-sm text-gray-600">A tarefa sempre será atribuída ao mesmo membro</span>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label for="frequencyDays" class="block text-sm font-medium text-gray-700 mb-2">
                Frequência (em dias) *
              </label>
              <input
                type="number"
                id="frequencyDays"
                name="frequencyDays"
                [(ngModel)]="formData.frequencyDays"
                required
                min="1"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                placeholder="1"
              />
              <p class="mt-2 text-sm text-gray-600">
                A cada quantos dias essa tarefa deve ser realizada? (1 = diariamente, 7 = semanalmente)
              </p>
            </div>

            @if (errorMessage()) {
              <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {{ errorMessage() }}
              </div>
            }

            <div class="flex gap-4 pt-4">
              <button
                type="submit"
                [disabled]="!taskForm.valid || loading()"
                class="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                @if (loading()) {
                  <span>{{ isEditMode() ? 'Salvando...' : 'Criando...' }}</span>
                } @else {
                  <span>{{ isEditMode() ? 'Salvar Alterações' : 'Criar Tarefa' }}</span>
                }
              </button>

              <a
                routerLink="/tasks"
                class="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition text-center"
              >
                Cancelar
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  `
})
export class TaskFormComponent implements OnInit {
  private taskService = inject(TaskService);
  authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formData: CreateTaskDto = {
    title: '',
    description: '',
    isRotation: true,
    frequencyDays: 1
  };

  loading = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);
  taskId: string | null = null;

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode.set(true);
      this.loadTask();
    }
  }

  loadTask(): void {
    if (!this.taskId) return;

    this.loading.set(true);
    this.taskService.getTask(this.taskId).subscribe({
      next: (task) => {
        this.formData = {
          title: task.title,
          description: task.description || '',
          isRotation: task.isRotation,
          frequencyDays: task.frequencyDays
        };
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const data: CreateTaskDto | UpdateTaskDto = {
      title: this.formData.title,
      description: this.formData.description || undefined,
      isRotation: this.formData.isRotation,
      frequencyDays: this.formData.frequencyDays
    };

    const request = this.isEditMode() && this.taskId
      ? this.taskService.updateTask(this.taskId, data)
      : this.taskService.createTask(data as CreateTaskDto);

    request.subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Erro ao salvar tarefa. Tente novamente.'
        );
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
