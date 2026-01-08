import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTable } from '../../../components/data-table/data-table';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { TableAction, TableColumn } from '../../../models/table.model';
import { AlertService } from '../../../services/alert.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-wallet-management',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, KapiCard],
  templateUrl: './wallet-management.html'
})
export class WalletManagement {
  private alert = inject(AlertService);
  private toast = inject(ToastService);

  selectedWallet = signal<any | null>(null);
  searchQuery = signal<string>('');

  // --- STATS GLOBALES ---
  stats = signal({
    totalCirculating: { value: '15,800,000 U', label: 'Masse monétaire totale' },
    frozenWallets: { value: '12', label: 'Comptes sous restriction' },
    totalFees: { value: '450,200 U', label: 'Frais générés' }
  });

  columns: TableColumn[] = [
    { key: 'user', label: 'Utilisateur' },
    { key: 'balance', label: 'Solde (U)' },
    { key: 'lastActivity', label: 'Dernière activité' },
    { key: 'status', label: 'État Wallet', type: 'badge' }
  ];

  wallets = signal([
    { id: 'W-001', user: 'Abdoulaye Diallo', balance: '250,000', lastActivity: 'Il y a 2 min', status: 'Actif', email: 'a.diallo@mail.com', isFrozen: false },
    { id: 'W-002', user: 'Sonia Kouamé', balance: '12,500', lastActivity: 'Hier', status: 'Gelé', email: 'sonia.k@mail.com', isFrozen: true },
    { id: 'W-003', user: 'Garage Central', balance: '1,200,000', lastActivity: 'Il y a 1 heure', status: 'Actif', email: 'contact@garage.com', isFrozen: false },
  ]);

  filteredWallets = computed(() => {
    return this.wallets().filter(w => w.user.toLowerCase().includes(this.searchQuery().toLowerCase()));
  });

  actions: TableAction[] = [
    { label: 'Gérer Wallet', icon: 'account_balance_wallet', callback: (w) => this.selectedWallet.set(w) },
    { 
      label: (w : any ) => w.isFrozen ? 'Dégeler' : 'Geler les fonds', 
      icon: (w : any) => w.isFrozen ? 'lock_open' : 'lock', 
      color: (w : any) => w.isFrozen ? 'text-emerald-600' : 'text-red-500',
      callback: (w) => this.toggleFreeze(w) 
    }
  ];

  async toggleFreeze(wallet: any) {
    const action = wallet.isFrozen ? 'dégeler' : 'geler';
    const ok = await this.alert.confirm(
      `Confirmer le blocage ?`,
      `L'utilisateur ${wallet.user} ne pourra plus effectuer de transactions jusqu'à nouvel ordre.`
    );

    if (ok) {
      this.wallets.update(list => list.map(w => 
        w.id === wallet.id ? { ...w, isFrozen: !w.isFrozen, status: !w.isFrozen ? 'Gelé' : 'Actif' } : w
      ));
      this.toast.show(`Le compte a été ${wallet.isFrozen ? 'débloqué' : 'gelé'}.`, 'info');
      if(this.selectedWallet()?.id === wallet.id) this.selectedWallet.set(null);
    }
  }

  getStatusClass(status: string) {
    return status === 'Actif' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700';
  }
}