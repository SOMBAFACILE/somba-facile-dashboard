import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastPosition } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.html',
  styleUrls: ['./toast-container.css']
})
export class ToastContainer {
  toastService = inject(ToastService);

  getPositionClass(): string {
    const pos = this.toastService.position();
    const classes: Record<ToastPosition, string> = {
      'top-right': 'top-0 right-0 items-end',
      'top-left': 'top-0 left-0 items-start',
      'bottom-right': 'bottom-0 right-0 items-end',
      'bottom-left': 'bottom-0 left-0 items-start',
      'top-center': 'top-0 left-1/2 -translate-x-1/2 items-center'
    };
    return classes[pos];
  }

  getToastTheme(type: string): string {
    const themes: Record<string, string> = {
      'success': 'bg-green-50 text-green-800 border-green-500 dark:bg-green-900/30 dark:text-green-400',
      'error': 'bg-red-50 text-red-800 border-red-500 dark:bg-red-900/30 dark:text-red-400',
      'warning': 'bg-yellow-50 text-yellow-800 border-yellow-500 dark:bg-yellow-900/30 dark:text-yellow-400',
      'info': 'bg-blue-50 text-blue-800 border-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
    };
    return themes[type];
  }
}