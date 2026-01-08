import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/API/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  templateUrl: './unauthorized.html',
  styleUrls: ['./unauthorized.css']
})
export class Unauthorized {
  private router = inject(Router);
  private authService = inject(AuthService);

  goHome() {
    const user = this.authService.currentUser();
    // Redirection intelligente selon le rôle
    if (user?.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/super-admin/overview']);
    } else {
      this.router.navigate(['/']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}