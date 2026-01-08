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
  selector: 'app-recharges',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, KapiCard],
  templateUrl: './recharges.html'
})
export class Recharges {
  private alert = inject(AlertService);
  private toast = inject(ToastService);

  // --- ÉTATS ---
  selectedRecharge = signal<any | null>(null);
  showManualRechargeForm = signal<boolean>(false);
  currentFilter = signal<string>('all');
  searchQuery = signal<string>('');

  // --- KPIs ---
  stats = signal({
    dailyVolume: { value: '320,500 U', label: 'Encaissé (24h)', isPositive: true },
    pendingCount: { value: '14', label: 'Preuves à vérifier', isPositive: false },
    agencyCash: { value: '85,000 U', label: 'Espèces en caisse', isPositive: true }
  });

  // --- CONFIGURATION TABLEAU ---
  columns: TableColumn[] = [
    { key: 'ref', label: 'Référence' },
    { key: 'user', label: 'Utilisateur' },
    { key: 'amount', label: 'Montant (U)' },
    { key: 'method', label: 'Méthode' },
    { key: 'status', label: 'Statut', type: 'badge' },
    { key: 'date', label: 'Date' }
  ];

  private allRecharges = signal([
    { id: 1, ref: 'RCG-7721', user: 'Marc Antoine', amount: '10,000', method: 'Orange Money', status: 'En attente', date: '2023-10-25 09:15', proofUrl: 'https://placehold.co/400x600?text=Recu+Orange' },
    { id: 2, ref: 'RCG-7722', user: 'Julie N.', amount: '5,500', method: 'Virement', status: 'En attente', date: '2023-10-25 10:05', proofUrl: 'https://placehold.co/400x600?text=Preuve+Virement' },
    { id: 3, ref: 'RCG-9900', user: 'Agence Central', amount: '50,000', method: 'Espèces (Agence)', status: 'Succès', date: '2023-10-24 18:20', proofUrl: null }
  ]);

  filteredRecharges = computed(() => {
    let list = this.allRecharges();
    if (this.currentFilter() !== 'all') {
      const statusLabel = this.currentFilter() === 'pending' ? 'En attente' : 'Succès';
      list = list.filter(r => r.status === statusLabel);
    }
    if (this.searchQuery()) {
      list = list.filter(r => r.user.toLowerCase().includes(this.searchQuery().toLowerCase()));
    }
    return list;
  });

  actions: TableAction[] = [
    { label: 'Vérifier', icon: 'receipt_long', callback: (rcg) => this.selectedRecharge.set(rcg) },
    { label: 'Créditer', icon: 'add_task', color: 'text-emerald-600', callback: (rcg) => this.approveRecharge(rcg) }
  ];

  // --- MODÈLE RECHARGE MANUELLE ---
  manualData = signal({ userIdentifier: '', amount: null, ref: '' });

  async handleManualRecharge() {
    const data = this.manualData();
    if (!data.userIdentifier || !data.amount) return this.toast.show('Champs requis', 'error');

    const ok = await this.alert.confirm('Confirmer l\'encaissement ?', `Voulez-vous créditer ${data.amount} U à ${data.userIdentifier} ?`);
    if (ok) {
      this.toast.show('Wallet crédité instantanément', 'success');
      this.showManualRechargeForm.set(false);
      this.manualData.set({ userIdentifier: '', amount: null, ref: '' });
    }
  }

  async approveRecharge(rcg: any) {
    const ok = await this.alert.confirm('Approuver la preuve ?', `Vérifiez bien le montant sur l'image avant de valider.`);
    if (ok) {
      this.allRecharges.update(list => list.map(item => item.id === rcg.id ? {...item, status: 'Succès'} : item));
      this.toast.show('Recharge validée', 'success');
      this.selectedRecharge.set(null);
    }
  }

  getStatusClass(status: string) {
    return status === 'Succès' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
  }
}