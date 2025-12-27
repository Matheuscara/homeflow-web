import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CreateUserDto } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-12">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">Criar Conta</h1>
          <p class="text-gray-600">Sua conta e família serão criadas automaticamente</p>
        </div>

        <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="space-y-5">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              [(ngModel)]="userData.name"
              required
              minlength="3"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="userData.email"
              required
              email
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">
              Data de Nascimento
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              [(ngModel)]="userData.birthDate"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="inviteCode" class="block text-sm font-medium text-gray-700 mb-2">
                Código de Convite
              </label>
              <input
                type="text"
                id="inviteCode"
                name="inviteCode"
                [(ngModel)]="userData.inviteCode"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Para entrar em uma família"
              />
            </div>

            <div>
              <label for="familyName" class="block text-sm font-medium text-gray-700 mb-2">
                Nome da Família
              </label>
              <input
                type="text"
                id="familyName"
                name="familyName"
                [(ngModel)]="userData.familyName"
                minlength="3"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="Para criar nova"
              />
            </div>
          </div>
          
          <p class="text-xs text-gray-500 -mt-3">
            Deixe ambos em branco para configurar sua família depois.
          </p>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="userData.password"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          @if (errorMessage()) {
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ errorMessage() }}
            </div>
          }

          <button
            type="submit"
            [disabled]="!registerForm.valid || loading()"
            class="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            @if (loading()) {
              <span>Criando conta...</span>
            } @else {
              <span>Criar Conta</span>
            }
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Já tem uma conta?
            <a routerLink="/auth/login" class="text-indigo-600 hover:text-indigo-700 font-medium ml-1">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userData: CreateUserDto = {
    email: '',
    password: '',
    name: '',
    birthDate: '',
    familyName: '',
    inviteCode: ''
  };

  loading = signal(false);
  errorMessage = signal('');

  onRegister(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.userData).subscribe({
      next: () => {
        // Após registro, usuário já tem família criada, vai direto para dashboard
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.loading.set(false);
        this.errorMessage.set(
          error.error?.message || 'Erro ao criar conta. Tente novamente.'
        );
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }
}
