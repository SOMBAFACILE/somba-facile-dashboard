import { Component, input, output, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KapiCard } from '../kapi-card/kapi-card';
import { DataTable } from '../data-table/data-table';
import { TableColumn } from '../../models/table.model';
import { environment } from '../../environments/environment';
import { AuthService } from '../../services/API/auth.service';

@Component({
  selector: 'app-vendor-detail',
  standalone: true,
  imports: [CommonModule, KapiCard, DataTable],
  templateUrl: './vendor-detail.html'
})
export class VendorDetail {
  // Input obligatoire recevant l'objet complet de la boutique
  vendor = input.required<any>();
  
  // Signal de sortie pour notifier le parent du retour à la liste
  onBack = output<void>();

  onAction = output<{type: string, payload: any}>(); // Pour notifier le parent des actions lourdes

  private auth = inject(AuthService);
  activeTab = signal<'products' | 'orders' | 'transactions' | 'dossier'>('products');

  // Vérification des permissions
  canManageFinance = signal(this.auth.hasRole('ROLE_ADMIN') || this.auth.hasRole('ROLE_FINANCE'));

  transacCols: TableColumn[] = [
    { key: 'createdAt', label: 'Date', type: 'date' },
    { key: 'reference', label: 'Réf' },
    { key: 'amount', label: 'Montant', type: 'currency' },
    { key: 'status', label: 'État', type: 'badge' },
    { key: 'actions', label: 'Actions' } // Colonne pour les boutons Détails/Annuler
  ];

  // Actions de suspension
  toggleSuspension() {
    this.onAction.emit({ type: 'TOGGLE_BAN', payload: this.vendor().id });
  }

  viewOrder(orderId: number) {
    this.onAction.emit({ type: 'VIEW_ORDER', payload: orderId });
  }


  // Configuration des colonnes pour les différents tableaux
  productCols: TableColumn[] = [
    { key: 'id', label: 'Ref.'},
    { key: 'image', label: '', type: 'image' },
    { key: 'name', label: 'Produit' },
    { key: 'price', label: 'Prix (U)' },
    { key: 'stock', label: 'Stock' },
    { key: 'status', label: 'Statut', type: 'badge' }
  ];

  orderCols: TableColumn[] = [
    { key: 'id', label: 'N°' },
    { key: 'customer', label: 'Client' },
    { key: 'date', label: 'Date', type: 'date' },
    { key: 'total', label: 'Total', type: 'currency' },
    { key: 'status', label: 'Statut', type: 'badge' }
  ];

  /**
   * Ouvre un document administratif dans un nouvel onglet
   * @param fileName Nom du fichier stocké
   */
  viewDocument(fileName: string) {
    if (!fileName) return;
    const url = `${environment.apiBaseUrl}/documents/${fileName}`;
    window.open(url, '_blank');
  }
}