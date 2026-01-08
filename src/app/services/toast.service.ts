import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  icon?: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Signal contenant la liste des toasts actifs
  toasts = signal<Toast[]>([]);
  
  // Position globale (par défaut en haut à droite)
  position = signal<ToastPosition>('top-right');

  show(message: string, type: ToastType = 'info', duration: number = 3000) {
    const id = Date.now();
    const icon = this.getDefaultIcon(type);
    
    this.toasts.update(current => [...current, { id, message, type, icon, duration }]);

    // Auto-suppression après la durée
    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  private getDefaultIcon(type: ToastType): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'cancel';
      case 'warning': return 'error';
      default: return 'info';
    }
  }
}