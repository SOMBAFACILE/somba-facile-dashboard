import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/API/auth.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private AlertService = inject(AlertService)

  showPassword = false;
  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  // login.component.ts
  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.redirectUser(user.roles);
    }
  }

  private redirectUser(roles: string[]) {
    if (roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/super-admin/overview']);
    } else if (roles.includes('ROLE_FINANCE')) {
      this.router.navigate(['/finance/overview']);
    } else {
      this.router.navigate(['/moderation/overview']);
    }
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;

      this.authService.login(email!, password!).subscribe({
        next: (res) => {
          // On sauvegarde les tokens (JWT + Refresh)
          this.authService.saveTokens(res.token);
          
          if (this.authService.hasRole('ROLE_ADMIN')) {
            this.router.navigate(['/super-admin/overview']);
          } else if (this.authService.hasRole('ROLE_FINANCE')) {
            this.router.navigate(['/finance/overview']);
          } else if(this.authService.hasRole('ROLE_MODERATOR')) {
            this.router.navigate(['/moderation/overview']);
          }
          console.log(res)
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
          this.AlertService.error("erreur de connexion", "Identifiants incorrects ou compte banni. En cas d'erreur contacter votre admin")
        }
      });
    }
  }
}