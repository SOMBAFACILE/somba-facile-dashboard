import { Component, input, output, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KapiCard } from '../kapi-card/kapi-card';
import { DataTable } from '../data-table/data-table';
import { TableAction, TableColumn } from '../../models/table.model';
import { AlertService } from '../../services/alert.service';
import { ModerationService } from '../../services/API/moderation.service';
import { ToastService } from '../../services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, KapiCard, DataTable],
  templateUrl: './user-detail.html'
})
export class UserDetail implements OnInit {
  user = input.required<any>();
  onBack = output<void>();
  
  private userService = inject(ModerationService);
  private alert = inject(AlertService);
  private toast = inject(ToastService);

  activeTab = signal<'orders' | 'wallet' | 'cart'>('orders');
  isLoading = signal(false);
  fullData = signal<any>(null);
  selectedOrder = signal<any | null>(null);

  orderCols: TableColumn[] = [
    { key: 'id', label: 'N° Commande' },
    { key: 'items', label: 'Nombre d\'articles' },
    { key: 'totalAmount', label: 'Montant', type: 'currency' },
    { key: 'status', label: 'Statut', type: 'badge' },
    { key: 'orderDate', label: 'Date', type: 'date' }
  ];

  OrderAction: TableAction[] = [
    { label: 'Voir Détails', icon: 'visibility', callback: (o) => this.selectedOrder.set(o) }
  ]

  walletCols: TableColumn[] = [
    { key: 'createdAt', label: 'Date', type: 'date' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'amount', label: 'Montant' },
    { key: 'reference', label: 'Référence' }
  ];

  cartCols: TableColumn[] = [
    { key: 'productName', label: 'Produit' },
    { key: 'quantity', label: 'Quantité' },
    { key: 'price', label: 'Prix Unitaire', type: 'currency' },
    { key: 'total', label: 'Total', type: 'currency' }
  ];

  ngOnInit() {
    this.loadUserDetails();
  }

  loadUserDetails() {
    this.isLoading.set(true);
    this.userService.getUserFullDetails(this.user().id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => this.fullData.set(data),
        error: () => this.toast.show("Échec du chargement des détails", 'error')
      });
  }

  async toggleStatus() {
    const isActif = this.user().status === 'Actif';
    let reason = '';

    if (isActif) {
      // Demander la raison du bannissement via une boîte de dialogue personnalisée ou prompt
      const result = await this.alert.prompt(
        "Motif du bannissement",
        `Pourquoi souhaitez-vous bannir ${this.user().fullName} ?`,
        "Ex: Comportement inapproprié, fraude..."
      );
      
      if (!result.confirmed || !result.value) return;
      reason = result.value;
    } else {
      const confirmed = await this.alert.confirm("Réactivation", `Voulez-vous réactiver le compte de ${this.user().fullName} ?`);
      if (!confirmed) return;
    }

    this.isLoading.set(true);
    this.userService.banUser(this.user().id, reason)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.show(`Utilisateur ${isActif ? 'banni' : 'réactivé'} avec succès`, 'success');
          this.onBack.emit();
        },
        error: () => this.toast.show("Erreur lors du changement de statut", 'error')
      });
  }

  async resetPassword() {
    const confirmed = await this.alert.confirm("Réinitialiser le mot de passe", "Envoyer un email de réinitialisation ?");
    if (confirmed) {
      this.isLoading.set(true);
      this.userService.resetPassword(this.user().id)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => this.toast.show("Email envoyé", 'success'),
          error: () => this.toast.show("Erreur d'envoi", 'error')
        });
    }
  }
}