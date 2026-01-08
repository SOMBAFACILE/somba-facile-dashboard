import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { DataTable } from '../../../components/data-table/data-table';
import { TableAction, TableColumn } from '../../../models/table.model';

@Component({
  selector: 'app-delivery-tracking',
  imports: [CommonModule, KapiCard, DataTable],
  standalone: true,
  templateUrl: './delivery-tracking.html',
  styleUrl: './delivery-tracking.css',
})
export class DeliveryTracking {
// 1. Données KPI
  public kpis = [
    { label: 'Colis en transit', value: '28', icon: 'local_shipping', color: 'text-blue-600' },
    { label: 'Délai moyen', value: '42 min', icon: 'speed', color: 'text-purple-600' },
    { label: 'Alertes retard', value: '5', icon: 'running_with_errors', color: 'text-red-600' }
  ];

  // 2. Configuration du Tableau
  deliveryColumns: TableColumn[] = [
    { key: 'orderId', label: 'Commande' },
    { key: 'courier', label: 'Livreur' },
    { key: 'pickupLocation', label: 'Boutique (Départ)' },
    { key: 'status', label: 'État Livraison', type: 'badge' },
    { key: 'eta', label: 'Arrivée Prévue' }
  ];

  deliveries = signal([
    { id: 1, orderId: '#ORD-8824', courier: 'Moussa K.', pickupLocation: 'Electro Store', status: 'En chemin', eta: '14:50' },
    { id: 2, orderId: '#ORD-8820', courier: 'Idriss B.', pickupLocation: 'Mode Look', status: 'Récupéré', eta: '15:15' },
    { id: 3, orderId: '#ORD-8815', courier: 'Kevin L.', pickupLocation: 'Cosmétiques Plus', status: 'Retardé', eta: '14:00 (Dépassé)' }
  ]);

  deliveryActions: TableAction[] = [
    { label: 'Suivre sur carte', icon: 'map', callback: (d) => {console.log('Détail commande', d)} },
    { label: 'Modifier livreur', icon: 'swap_horiz', callback: (d) => {} }
  ];

}
