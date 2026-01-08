import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { DataTable } from '../../../components/data-table/data-table';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { TableAction, TableColumn } from '../../../models/table.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-commissions',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, KapiCard],
  templateUrl: './commission-settings.html'
})
export class CommissionSettings {
  private toast = inject(ToastService);

  // --- ÉTATS ---
  viewMode = signal<'categories' | 'shops' | 'recharges'>('categories');
  isEditing = signal<boolean>(false);
  selectedRule = signal<any | null>(null);

  // Ajout des signaux pour la taxe de recharge

  rechargeFees = signal({
    type: 'percentage', // 'fixed' ou 'percentage'
    value: 2,           // ex: 2%
    fixedAmount: 100,   // ex: 100 U par recharge
    minAmount: 50,      // frais minimum
    isActive: true
  });

  // Colonnes pour l'historique des taxes collectées (optionnel mais utile)
  rechargeStatsColumns: TableColumn[] = [
    { key: 'date', label: 'Période' },
    { key: 'volume', label: 'Volume Recharges' },
    { key: 'collected', label: 'Taxes Perçues (U)' },
    { key: 'count', label: 'Nombre Opérations' }
  ];

  updateRechargeFee() {
    this.toast.show('Paramètres de taxe de recharge enregistrés', 'success');
  }

  // --- STATS ---
  stats = signal({
    avgCommission: { value: '8.5%', label: 'Moyenne globale' },
    topCategory: { value: 'Électronique', label: 'Plus gros volume' },
    monthlyRevenue: { value: '1,250,000 U', label: 'Revenus commissions' }
  });

  // --- CONFIGURATION TABLEAUX ---
  catColumns: TableColumn[] = [
    { key: 'name', label: 'Catégorie' },
    { key: 'rate', label: 'Taux Commission (%)' },
    { key: 'itemCount', label: 'Nombre de Produits' },
    { key: 'status', label: 'État', type: 'badge' }
  ];

  shopColumns: TableColumn[] = [
    { key: 'shopName', label: 'Boutique' },
    { key: 'customRate', label: 'Taux Spécifique (%)' },
    { key: 'type', label: 'Type Contrat' },
    { key: 'status', label: 'État', type: 'badge' }
  ];

  // --- DONNÉES ---
  categories = signal([
    { id: 1, name: 'Électronique', rate: 12, itemCount: 450, status: 'Actif' },
    { id: 2, name: 'Mode & Beauté', rate: 15, itemCount: 1200, status: 'Actif' },
    { id: 3, name: 'Alimentation', rate: 5, itemCount: 890, status: 'Actif' }
  ]);

  shopExceptions = signal([
    { id: 101, shopName: 'Samsung Official', customRate: 8, type: 'Partenaire VIP', status: 'Actif' },
    { id: 102, shopName: 'Boulangerie Local', customRate: 3, type: 'Artisan', status: 'Actif' }
  ]);

  actions: TableAction[] = [
    { label: 'Modifier Taux', icon: 'edit', callback: (row) => this.openEdit(row) },
    { label: 'Désactiver', icon: 'block', color: 'text-red-500', callback: (row) => this.toggleStatus(row) }
  ];

  openEdit(rule: any) {
    this.selectedRule.set({ ...rule });
    this.isEditing.set(true);
  }

  saveCommission() {
    this.toast.show('Taux de commission mis à jour !', 'success');
    this.isEditing.set(false);
  }

  toggleStatus(row: any) {
    this.toast.show('Statut de la règle modifié', 'info');
  }
}