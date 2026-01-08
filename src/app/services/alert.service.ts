import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // Alerte de succès rapide
  success(title: string, message: string = '') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      confirmButtonColor: '#4F46E5', // Ta couleur primary
      timer: 2000
    });
  }

  // Alerte d'erreur
  error(title: string, message: string = '') {
    Swal.fire({
      title: title,
      text: message,
      icon: 'error',
      confirmButtonColor: '#EF4444',
    });
  }

  // LA PLUS UTILE : Confirmation de suppression
  async confirm(title: string = 'Êtes-vous sûr ?', text: string = "Cette action est irréversible !"): Promise<boolean> {
    const result = await Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4F46E5',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Oui, continuer',
      cancelButtonText: 'Annuler',
      background: document.documentElement.classList.contains('dark') ? '#1F2937' : '#FFFFFF',
      color: document.documentElement.classList.contains('dark') ? '#F9FAFB' : '#1F2937',
    });

    return result.isConfirmed;
  }
  
  /**
   * Nouvelle méthode Prompt pour capturer la raison du ban
   */
  async prompt(title: string, text: string, placeholder: string = ''): Promise<{ confirmed: boolean, value: string }> {
    const { value: textResult, isConfirmed } = await Swal.fire({
      title: title,
      text: text,
      input: 'textarea', // Champ de saisie
      inputPlaceholder: placeholder,
      inputAttributes: {
        'aria-label': placeholder
      },
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#d33', // Rouge pour le ban
      inputValidator: (value) => {
        if (!value) {
          return 'Vous devez spécifier un motif pour le bannissement !';
        }
        return null;
      }
    });

    return {
      confirmed: isConfirmed,
      value: textResult || ''
    };
  }
}