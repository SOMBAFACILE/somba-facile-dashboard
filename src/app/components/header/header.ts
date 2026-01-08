import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../services/layouts.service';
import { AuthService } from '../../services/API/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {
  layoutService = inject(LayoutService);
  isProfileOpen = signal(false);
  authService = inject(AuthService);

  user = this.authService.currentUser();

  toggleProfile() {
    this.isProfileOpen.update(v => !v);
  }
}