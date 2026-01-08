import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { DataTable } from '../../../components/data-table/data-table';
import { TableColumn, TableAction } from '../../../models/table.model';
import { DisputeDetail } from '../../../components/dispute-detail/dispute-detail';

@Component({
  selector: 'app-dispute-list',
  standalone: true,
  imports: [CommonModule, KapiCard, DataTable, DisputeDetail],
  templateUrl: './dispute-list.html'
})
export class DisputeList {
  SelectedDispute = signal<any>(null);

  public kapis = [
    { label: 'Litiges Ouverts', value: '12', icon: 'gavel', color: 'text-red-600' },
    { label: 'Arbitrage en cours', value: '5', icon: 'balance', color: 'text-orange-500' },
    { label: 'Total Remboursé (U)', value: '15,000', icon: 'undo', color: 'text-blue-600' }
  ];

  disputeColumns: TableColumn[] = [
    { key: 'id', label: 'Ticket ID' },
    { key: 'orderId', label: 'Commande' },
    { key: 'claimant', label: 'Plaignant' },
    { key: 'type', label: 'Motif' },
    { key: 'priority', label: 'Priorité', type: 'badge' },
    { key: 'status', label: 'Statut', type: 'badge' }
  ];

  disputes = signal([
    { id: '#TK-102', orderId: '#ORD-8824', claimant: 'Jean Dupont', type: 'Produit non reçu', priority: 'Haute', status: 'Ouvert' },
    { id: '#TK-105', orderId: '#ORD-9012', claimant: 'Boutique Alpha', type: 'Retour endommagé', priority: 'Moyenne', status: 'Arbitrage' }
  ]);

  disputeActions: TableAction[] = [
    { label: 'Ouvrir l\'arbitrage', icon: 'forum', callback: (d) => this.SelectedDispute.set(d) },
    { label: 'Rembourser Client', icon: 'payments', color: 'text-green-600', callback: (d) => {} },
    { label: 'Clôturer', icon: 'check_circle', callback: (d) => {} }
  ];
}