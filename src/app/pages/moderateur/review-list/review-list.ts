import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableColumn, TableAction } from '../../../models/table.model';
import { ModerationService } from '../../../services/API/moderation.service';
import { DataTable } from '../../../components/data-table/data-table';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { AlertService } from '../../../services/alert.service';
import { ToastService } from '../../../services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule, DataTable, KapiCard, FormsModule],
  templateUrl: './review-list.html'
})
export class ReviewList implements OnInit {
  private moderationService = inject(ModerationService);
  private alert = inject(AlertService);
  private toast = inject(ToastService);

  public activeTab = signal<'product-reports' | 'vendor-strikes'>('product-reports');
  public isLoading = signal(false);
  
  public productReports = signal<any[]>([]);
  public vendorAlerts = signal<any[]>([]);

  ngOnInit() { this.refreshData(); }

  refreshData() {
    this.isLoading.set(true);
    this.moderationService.getReviewAlertsDashboard()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => {
          console.log(data);
          this.productReports.set(data.productReports);
          this.vendorAlerts.set(data.vendorAlerts);
        },
        error: () => this.toast.show('Erreur de synchronisation', 'error')
      });
  }

  // --- Configuration des Colonnes selon l'onglet ---
  public columns = computed<TableColumn[]>(() => {
    if (this.activeTab() === 'product-reports') {
      return [
        { key: 'productName', label: 'Produit Signalé' },
        { key: 'totalReports', label: 'Plaintes', type: 'badge' },
        { key: 'avgRating', label: 'Note Client', type: 'badge' },
        { key: 'vendorName', label: 'Boutique' },
        { key: 'lastReportReason', label: 'Dernier Motif' }
      ];
    }
    return [
      { key: 'vendorName', label: 'Boutique' },
      { key: 'strikeCount', label: 'Strikes Actifs', type: 'badge' },
      { key: 'reportSource', label: 'Origine Plainte' },
      { key: 'reputationScore', label: 'Confiance (%)' },
      { key: 'status', label: 'État Compte', type: 'badge' }
    ];
  });

  // --- Actions de Modération ---
  public actions = computed<TableAction[]>(() => {
    if (this.activeTab() === 'product-reports') {
      return [
        { label: 'Inspecter Avis', icon: 'visibility', callback: (p) => this.inspectProduct(p) },
        { label: 'Sanctionner Boutique', icon: 'warning', color: 'text-orange-500', callback: (p) => this.applyStrike(p) }
      ];
    }
    return [
      { label: 'Historique Strikes', icon: 'history', callback: (v) => this.viewHistory(v) },
      { label: 'Suspendre Boutique', icon: 'block', color: 'text-red-700', callback: (v) => this.suspendVendor(v) }
    ];
  });

  async applyStrike(item: any) {
    const res = await this.alert.prompt('Émettre un Strike', `Motif de l'avertissement pour ${item.vendorName}:`);
    if (res.confirmed && res.value) {
      this.moderationService.issueVendorStrike(item.vendorId, res.value, item.productId || null)
        .subscribe(() => {
          this.toast.show('Avertissement envoyé au vendeur', 'success');
          this.refreshData();
        });
    }
  }

  async suspendVendor(vendor: any) {
    const confirm = await this.alert.confirm('SUSPENSION CRITIQUE', `Confirmez-vous la suspension du compte ${vendor.vendorName} ?`);
    if (confirm) {
      this.moderationService.updateVendorAccountStatus(vendor.vendorId, 'SUSPENDED')
        .subscribe(() => {
          this.toast.show('Boutique suspendue avec succès');
          this.refreshData();
        });
    }
  }

  inspectProduct(product: any) {
    // Logique pour ouvrir le modal de preview que nous avons fait précédemment
    this.toast.show('Ouverture du dossier de preuves...');
  }

  viewHistory(vendor: any) {
    this.toast.show('Chargement de l\'historique des litiges...');
  }
}