import { Component, signal } from '@angular/core';
import { TableAction, TableColumn } from '../../../models/table.model';
import { CommonModule } from '@angular/common';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { DataTable } from '../../../components/data-table/data-table';
import { OrderDetail } from '../../../components/order-detail/order-detail';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule,KapiCard, DataTable, OrderDetail],
  standalone : true,
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
// order-list.component.ts
export class OrderList {
  SelectedOrder = signal<any|null>(null);

  public kpis = [
    { label: 'Commandes du jour', value: '145', icon: 'shopping_cart', color: 'text-primary' },
    { label: 'Volume d\'affaires (U)', value: '85,400', icon: 'monetization_on', color: 'text-green-600' },
    { label: 'Paiements Suspendus', value: '3', icon: 'pause_circle', color: 'text-orange-500' }
  ];

  // 2. Configuration du Tableau
  orderColumns: TableColumn[] = [
    { key: 'id', label: 'ID Commande' },
    { key: 'customer', label: 'Client' },
    { key: 'vendor', label: 'Boutique' },
    { key: 'amount', label: 'Montant (U)' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Paiement', type: 'badge' }
  ];

  orders = signal([
    { id: '#ORD-8824', customer: 'Jean Dupont', vendor: 'Electro Store', amount: '4,500', date: '25/12/2025 14:20', status: 'Confirmé' },
    { id: '#ORD-8825', customer: 'Marie Claire', vendor: 'Fashion Look', amount: '1,200', date: '25/12/2025 15:10', status: 'En attente' },
    { id: '#ORD-8826', customer: 'Awa Diop', vendor: 'Cosmétiques Plus', amount: '850', date: '25/12/2025 15:45', status: 'Suspendu' }
  ]);

  orderActions: TableAction[] = [
    { label: 'Détails', icon: 'visibility', callback: (o) => this.ShowOrderDetail(o) },
    { label: 'Geler Paiement', icon: 'lock_clock', color: 'text-orange-500', callback: (o) => {} }
  ];

  ShowOrderDetail(order : any){
    this.SelectedOrder.set(order);
  }
}
