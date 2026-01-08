import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Observable, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly API_URL = environment.apiUrl;

  // Signal pour l'état de l'utilisateur (réactivité Angular 17)
  currentUser = signal<any>(null);

  constructor() {
    this.loadUserFromStorage();
  }

    login(email: string, password: string): Observable<any> {
      console.log({email, password});
        return this.http.post(`${this.API_URL}/auth/login`, {
            email: email, // Symfony (LexikJWT) attend souvent 'username' par défaut
            password: password
        });
    }

  /**
   * Rafraîchit le token JWT en utilisant le refresh_token
   */
  refreshTokenApi(refreshToken: string | null): Observable<any> {
    return this.http.post(`${this.API_URL}/token/refresh`, {
      refresh_token: refreshToken
    });
  }

  /**
   * Déconnexion complète
   */
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Enregistre les tokens et décode le payload
   */
  saveTokens(accessToken: string, refreshToken: string = '') {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    this.decodeAndNotify(accessToken);
  }

  private decodeAndNotify(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      // On vérifie si l'utilisateur est banni directement depuis le token
      if (decoded.isBanned) {
        this.logout();
        return;
      }
      this.currentUser.set(decoded);
    } catch (e) {
      this.logout();
    }
  }

  private loadUserFromStorage() {
    const token = this.getAccessToken();
    if (token) this.decodeAndNotify(token);
  }

  getAccessToken() { return localStorage.getItem('access_token'); }
  getRefreshToken() { return localStorage.getItem('refresh_token'); }

  // Utilitaire pour vérifier les rôles dans les templates
  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user ? user.roles.includes(role) : false;
  }
}