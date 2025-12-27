import { Component, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FamilyService } from '../../../services/family.service';
import { AuthService } from '../../../services/auth.service';
import { Family } from '../../../models/family.model';

@Component({
  selector: 'app-family-details',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <header class="bg-white shadow-sm border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold text-gray-900">Minha Família</h1>
            <div class="flex items-center gap-4">
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
            <p class="text-gray-600 mt-4">Carregando informações...</p>
          </div>
        } @else if (family(); as familyData) {
          <div class="space-y-6">
            <!-- Family Info -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Informações da Família</h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                  <p class="text-lg text-gray-900">{{ familyData.name }}</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Código de Convite</label>
                  <div class="flex items-center gap-3">
                    <code class="text-lg font-mono bg-gray-100 px-4 py-2 rounded-lg">{{ familyData.inviteCode }}</code>
                    <button
                      (click)="copyInviteCode()"
                      class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
                    >
                      {{ copied() ? 'Copiado!' : 'Copiar' }}
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-2">
                    Compartilhe este código para convidar novos membros
                  </p>
                </div>
              </div>
            </div>

            <!-- Members List -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900 mb-4">
                Membros ({{ familyData.users.length }})
              </h2>

              <div class="space-y-3">
                @for (user of familyData.users; track user.id) {
                  <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span class="text-indigo-700 font-semibold text-lg">
                          {{ user.name.charAt(0).toUpperCase() }}
                        </span>
                      </div>

                      <div>
                        <div class="flex items-center gap-2">
                          <p class="font-medium text-gray-900">{{ user.name }}</p>
                          @if (user.id === familyData.adminId) {
                            <span class="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                              Admin
                            </span>
                          }
                          @if (user.id === authService.currentUser()?.id) {
                            <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                              Você
                            </span>
                          }
                        </div>
                        <p class="text-sm text-gray-600">{{ user.email }}</p>
                      </div>
                    </div>

                    <div class="text-sm text-gray-500">
                      {{ calculateAge(user.birthDate) }} anos
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Danger Zone -->
            @if (authService.currentUser()?.id !== family()?.adminId) {
              <div class="bg-red-50 rounded-xl shadow-sm border border-red-200 p-6">
                <h2 class="text-xl font-semibold text-red-900 mb-2">Zona de Perigo</h2>
                <p class="text-sm text-red-700 mb-4">
                  Ao sair da família, você perderá acesso a todas as tarefas e informações.
                </p>
                <button
                  (click)="leaveFamily()"
                  class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Sair da Família
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Você não faz parte de uma família</h3>
            <p class="mt-2 text-sm text-gray-600">Crie uma nova família ou entre em uma existente.</p>
            <a
              routerLink="/family/setup"
              class="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Configurar Família
            </a>
          </div>
        }
      </main>
    </div>
  `
})
export class FamilyDetailsComponent implements OnInit {
  familyService = inject(FamilyService);
  authService = inject(AuthService);
  private router = inject(Router);

  family = this.familyService.currentFamily;
  loading = signal(true);
  copied = signal(false);

  ngOnInit(): void {
    this.loadFamily();
  }

  loadFamily(): void {
    this.loading.set(true);
    this.familyService.getMyFamily().subscribe({
      next: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  copyInviteCode(): void {
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);

    if (!isBrowser) return;

    const inviteCode = this.family()?.inviteCode;
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode).then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      });
    }
  }

  calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  leaveFamily(): void {
    if (confirm('Tem certeza que deseja sair da família? Esta ação não pode ser desfeita.')) {
      this.familyService.leaveFamily().subscribe({
        next: () => {
          this.router.navigate(['/family/setup']);
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
