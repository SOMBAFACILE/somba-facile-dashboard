import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { DataTable } from '../../../components/data-table/data-table';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { TableAction, TableColumn } from '../../../models/table.model';
import { AlertService } from '../../../services/alert.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-withdrawals',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, KapiCard],
  templateUrl: './withdrawals.html'
})
export class Withdrawals {
  private alert = inject(AlertService);
  private toast = inject(ToastService);

  // --- ÉTATS & FILTRES ---
  currentFilter = signal<string>('all');
  searchQuery = signal<string>('');
  selectedWithdrawal = signal<any | null>(null);
  showManualWithdrawalForm = signal<boolean>(false);

  // --- KPIs FINANCIERS ---
  public stats = signal({
    totalPending: { value: '45,800 U', count: 12, label: 'En attente' },
    processedToday: { value: '125,000 U', count: 24, label: 'Payés (24h)' },
    availableCash: { value: '2,450,000 U', label: 'Réserve Cash' }
  });

  // --- CONFIGURATION TABLEAU ---
  columns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'vendor', label: 'Boutique / Client' },
    { key: 'amount', label: 'Montant (U)' },
    { key: 'method', label: 'Méthode' },
    { key: 'status', label: 'Statut', type: 'badge' },
    { key: 'date', label: 'Date' }
  ];

  // Données sources
  private allRequests = signal([
    { id: 'W-9901', vendor: 'Electro Store', amount: '5,000', method: 'Mobile Money', account: '+225 01020304', status: 'En attente', date: '2023-10-25 10:30', fee: '100' },
    { id: 'W-9902', vendor: 'Jean Dupont', amount: '1,200', method: 'Virement', account: 'FR76 3000...', status: 'En attente', date: '2023-10-25 11:15', fee: '24' },
    { id: 'W-9890', vendor: 'Fashion Hub', amount: '8,500', method: 'Espèces', account: 'Guichet Agence', status: 'Terminé', date: '2023-10-24 16:45', fee: '0' }
  ]);

  // Liste filtrée dynamiquement
  filteredRequests = computed(() => {
    let list = this.allRequests();
    if (this.currentFilter() !== 'all') {
      const statusMap: any = { 'pending': 'En attente', 'completed': 'Terminé' };
      list = list.filter(r => r.status === statusMap[this.currentFilter()]);
    }
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      list = list.filter(r => r.vendor.toLowerCase().includes(query) || r.id.toLowerCase().includes(query));
    }
    return list;
  });

  actions: TableAction[] = [
    { label: 'Détails', icon: 'visibility', callback: (req) => this.selectedWithdrawal.set(req) },
    { label: 'Approuver', icon: 'check_circle', color: 'text-green-600', callback: (req) => this.processWithdrawal(req) },
    { label: 'Rejeter', icon: 'cancel', color: 'text-red-500', callback: (req) => this.rejectWithdrawal(req) }
  ];

  // --- MODÈLE RETRAIT MANUEL ---
  manualData = signal({ userIdentifier: '', amount: null });

    // Nouvel état pour le suivi de la validation PIN
  isWaitingForUserPin = signal<boolean>(false);
  pinValidationTimer = signal<number>(60); // Compte à rebours de 60s

  async handleManualWithdrawal() {
    const data = this.manualData();
    if (!data.userIdentifier || !data.amount) return this.toast.show('Champs requis', 'error');

    // 1. On lance la demande vers le mobile de l'utilisateur
    this.isWaitingForUserPin.set(true);
    this.toast.show('Demande envoyée sur le mobile du client...', 'info');

    // 2. Simulation de l'attente de validation (via WebSocket ou Polling)
    this.startPinTimer();

    // Note : Dans la vraie application, vous écouteriez un événement backend ici
    // simulation d'une réponse positive après 5 secondes :
    setTimeout(() => {
      this.completeManualWithdrawal();
    }, 15000);
  }

  completeManualWithdrawal() {
    this.isWaitingForUserPin.set(false);
    this.showManualWithdrawalForm.set(false);
    this.toast.show('Paiement autorisé par PIN. Vous pouvez remettre les espèces.', 'success');
    this.resetManualForm();
  }

  startPinTimer() {
    const interval = setInterval(() => {
      this.pinValidationTimer.update(v => v - 1);
      if (this.pinValidationTimer() <= 0 || !this.isWaitingForUserPin()) {
        clearInterval(interval);
        if (this.isWaitingForUserPin()) this.cancelPinRequest();
      }
    }, 50000);
  }

  cancelPinRequest() {
    this.isWaitingForUserPin.set(false);
    this.toast.show('Délai expiré ou validation annulée par le client.', 'error');
  }

  // async handleManualWithdrawal() {
  //   const data = this.manualData();
  //   if (!data.userIdentifier || !data.amount) return this.toast.show('Champs requis', 'error');

  //   const ok = await this.alert.confirm('Retrait Espèces', `Confirmer le décaissement de ${data.amount} U ?`);
  //   if (ok) {
  //     this.toast.show('Retrait guichet validé', 'success');
  //     this.showManualWithdrawalForm.set(false);
  //     this.resetManualForm();
  //   }
  // }

  // Helpers de statut
  getStatusClass(status: string) {
    if (status === 'En attente') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    if (status === 'Terminé') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
    return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }

  private resetManualForm() { this.manualData.set({ userIdentifier: '', amount: null }); }
  private processWithdrawal(req: any) { /* Logique d'approbation */ }
  private rejectWithdrawal(req: any) { /* Logique de rejet */ }
}