import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../services/toast.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-cash-closure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cash-closure.html'
})
export class CashClosure {
  private toast = inject(ToastService);
  private alert = inject(AlertService);

  // --- DONNÉES SYSTÈME (Calculées automatiquement) ---
  systemData = signal({
    openingBalance: 50000,    // Solde du matin
    totalIn: 450000,         // Recharges du jour
    totalOut: 120000,        // Retraits du jour
  });

  // --- SAISIE DU COMPTABLE ---
  physicalCash = signal<number | null>(null);
  notes = signal<string>('');

  // --- CALCULS ---
  theoreticalBalance = computed(() => {
    return this.systemData().openingBalance + this.systemData().totalIn - this.systemData().totalOut;
  });

  discrepancy = computed(() => {
    if (this.physicalCash() === null) return 0;
    return (this.physicalCash() || 0) - this.theoreticalBalance();
  });

  async submitClosure() {
    if (this.physicalCash() === null) return this.toast.show('Veuillez saisir le montant physique', 'error');

    const message = this.discrepancy() === 0 
      ? "La caisse est parfaite. Confirmer la clôture ?" 
      : `Écart détecté de ${this.discrepancy()} U. Confirmer malgré l'écart ?`;

    const ok = await this.alert.confirm('Clôture de Caisse', message);
    
    if (ok) {
      this.toast.show('Journée clôturée avec succès. Rapport envoyé.', 'success');
      // Logique pour figer la journée et imprimer le Z-Report
    }
  }
}