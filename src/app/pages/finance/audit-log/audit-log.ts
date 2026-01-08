import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTable } from '../../../components/data-table/data-table';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { TableAction, TableColumn } from '../../../models/table.model';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTable, KapiCard],
  templateUrl: './audit-log.html'
})
export class AuditLog {
  // --- ÉTATS ---
  searchQuery = signal<string>('');
  filterType = signal<'all' | 'in' | 'out'>('all');
  selectedLog = signal<any | null>(null); // Pour le panneau de détails

  // --- KPIs ---
  stats = signal({
    netBalance: { value: '2,129,500 U', label: 'Balance Système' },
    totalIn: { value: '3,500,000 U', label: 'Flux Entrant' },
    totalOut: { value: '1,370,500 U', label: 'Flux Sortant' }
  });

  columns: TableColumn[] = [
    { key: 'timestamp', label: 'Date & Heure' },
    { key: 'type', label: 'Flux', type: 'badge' },
    { key: 'actor', label: 'Initié par' },
    { key: 'target', label: 'Bénéficiaire' },
    { key: 'amount', label: 'Montant' },
    { key: 'status', label: 'Statut', type: 'badge' }
  ];

  private transactions = signal([
    { 
      id: 'TX-9901', 
      timestamp: '2023-10-25 14:20', 
      type: 'Sortie', 
      actor: 'Comptable_Jean', 
      target: 'Boutique_Electro', 
      amount: '-5,000 U', 
      status: 'Validé', 
      category: 'out',
      method: 'Mobile Money (+225 0102...)',
      auditHash: 'sha256:7b5e...a12',
      ipSource: '192.168.1.45',
      note: 'Retrait de bénéfices hebdomadaires.'
    },
    { 
      id: 'TX-9902', 
      timestamp: '2023-10-25 14:05', 
      type: 'Entrée', 
      actor: 'Guichet_Abidjan', 
      target: 'Client_Marc', 
      amount: '+10,000 U', 
      status: 'Validé', 
      category: 'in',
      method: 'Espèces (Agence)',
      auditHash: 'sha256:4r9f...b88',
      ipSource: '10.0.0.5',
      note: 'Recharge physique au comptoir.'
    }
  ]);

  filteredLogs = computed(() => {
    let list = this.transactions();
    if (this.filterType() !== 'all') list = list.filter(t => t.category === this.filterType());
    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      list = list.filter(t => t.target.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    return list;
  });

  actions: TableAction[] = [
    { label: 'Détails Audit', icon: 'history_edu', callback: (t) => this.selectedLog.set(t) },
    { label: 'Certificat', icon: 'verified', color: 'text-blue-500', callback: (t) => alert('Génération du certificat...') }
  ];

  getTypeClass(type: string) {
    return type === 'Entrée' 
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  }
}