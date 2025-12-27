import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FamilyService } from '../../../services/family.service';
import { CreateFamilyDto, JoinFamilyDto } from '../../../models/family.model';

@Component({
  selector: 'app-family-setup',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div class="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Configurar Família</h1>
          <p class="text-gray-600">Crie uma nova família ou entre em uma existente</p>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Create Family -->
          <div class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Criar Nova Família</h2>
            <form (ngSubmit)="onCreateFamily()" #createForm="ngForm" class="space-y-4">
              <div>
                <label for="familyName" class="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Família
                </label>
                <input
                  type="text"
                  id="familyName"
                  name="familyName"
                  [(ngModel)]="createData.name"
                  required
                  minlength="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Ex: Família Silva"
                />
              </div>

              @if (createError()) {
                <div class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {{ createError() }}
                </div>
              }

              <button
                type="submit"
                [disabled]="!createForm.valid || createLoading()"
                class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                @if (createLoading()) {
                  <span>Criando...</span>
                } @else {
                  <span>Criar Família</span>
                }
              </button>
            </form>
          </div>

          <!-- Join Family -->
          <div class="border border-gray-200 rounded-xl p-6 hover:shadow-md transition">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Entrar em Família</h2>
            <form (ngSubmit)="onJoinFamily()" #joinForm="ngForm" class="space-y-4">
              <div>
                <label for="inviteCode" class="block text-sm font-medium text-gray-700 mb-2">
                  Código de Convite
                </label>
                <input
                  type="text"
                  id="inviteCode"
                  name="inviteCode"
                  [(ngModel)]="joinData.inviteCode"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none font-mono"
                  placeholder="XXXXXXXXXXXXXX"
                />
                <p class="text-xs text-gray-500 mt-2">
                  Digite o código compartilhado pelo administrador da família
                </p>
              </div>

              @if (joinError()) {
                <div class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {{ joinError() }}
                </div>
              }

              <button
                type="submit"
                [disabled]="!joinForm.valid || joinLoading()"
                class="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                @if (joinLoading()) {
                  <span>Entrando...</span>
                } @else {
                  <span>Entrar na Família</span>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SetupComponent {
  private familyService = inject(FamilyService);
  private router = inject(Router);

  createData: CreateFamilyDto = { name: '' };
  joinData: JoinFamilyDto = { inviteCode: '' };

  createLoading = signal(false);
  joinLoading = signal(false);
  createError = signal('');
  joinError = signal('');

  onCreateFamily(): void {
    this.createLoading.set(true);
    this.createError.set('');

    this.familyService.createFamily(this.createData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.createLoading.set(false);
        this.createError.set(error.error?.message || 'Erro ao criar família.');
      },
      complete: () => {
        this.createLoading.set(false);
      }
    });
  }

  onJoinFamily(): void {
    this.joinLoading.set(true);
    this.joinError.set('');

    this.familyService.joinFamily(this.joinData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.joinLoading.set(false);
        this.joinError.set(error.error?.message || 'Código de convite inválido.');
      },
      complete: () => {
        this.joinLoading.set(false);
      }
    });
  }
}
