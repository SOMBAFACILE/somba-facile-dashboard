import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { DataTable } from '../../../components/data-table/data-table';
import { TableColumn, TableAction } from '../../../models/table.model';
import { ModerationService } from '../../../services/API/moderation.service';
import { AlertService } from '../../../services/alert.service';
import { ToastService } from '../../../services/toast.service';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { VendorDetail } from '../../../components/vendor-detail/vendor-detail';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule, KapiCard, DataTable, VendorDetail],
  templateUrl: './vendor-list.html'
})
export class VendorList implements OnInit {
  private moderationService = inject(ModerationService);
  private alert = inject(AlertService);
  private toast = inject(ToastService);

  // --- États ---
  public isLoading = signal(false);
  public viewMode = signal<'list' | 'folder' | 'profile'>('list');
  public selectedVendor = signal<any | null>(null);
  private allVendors = signal<any[]>([]);

  // --- Filtres ---
  public searchTerm = signal('');
  public statusFilter = signal('Tous');

  // --- KPIs Dynamiques ---
  public kpis = computed(() => [
    { label: 'Boutiques Actives', value: this.allVendors().filter(v => v.validationStatus === 'APPROVED').length, icon: 'storefront', color: 'text-green-600' },
    { label: 'En attente', value: this.allVendors().filter(v => v.validationStatus === 'PENDING').length, icon: 'pending_actions', color: 'text-orange-500' },
    { label: 'Boutiques Rejetées', value: this.allVendors().filter(v => v.validationStatus === 'REJECTED').length, icon: 'unpublished', color: 'text-red-600' }
  ]);

  // --- Configuration de la Table ---
  vendorColumns: TableColumn[] = [
    { key: 'logo', label: '', type: 'image' },
    { key: 'name', label: 'Boutique' },
    { key: 'ownerFullName', label: 'Propriétaire' },
    { key: 'createdAt', label: 'Date Demande', type: 'date' },
    { key: 'validationStatus', label: 'Statut', type: 'badge' }
  ];

  vendorActions: TableAction[] = [
    { 
      label: 'Gérer le dossier', 
      icon: 'fact_check', 
      // Utilisation du paramètre condition pour filtrer l'affichage
      condition: (v) => v.validationStatus === 'PENDING' || v.validationStatus === 'En attente',
      callback: (v) => this.openView(v, 'folder') 
    },
    { 
      label: 'Voir les détails', 
      icon: 'visibility', 
      condition: (v) => v.validationStatus === 'APPROVED' || v.validationStatus === 'Actif',
      callback: (v) => this.openVendorDetail(v) 
    }
  ];

  // --- Filtrage des données ---
  filteredVendors = computed(() => {
    return this.allVendors().filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(this.searchTerm().toLowerCase()) || 
                           v.ownerFullName?.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesStatus = this.statusFilter() === 'Tous' || v.validationStatus === this.statusFilter();
      return matchesSearch && matchesStatus;
    });
  });

  ngOnInit() { this.loadVendors(); }

  loadVendors() {
    this.isLoading.set(true);
    this.moderationService.getVendors()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.allVendors.set(res),
        error: () => this.toast.show("Erreur lors de la récupération des vendeurs", "error")
      });
  }

  openView(vendor: any, mode: 'folder' | 'profile') {
    this.selectedVendor.set(vendor);
    this.viewMode.set(mode);
  }

  public selectedVendorData = signal<any | null>(null); 

  openVendorDetail(vendor: any) {
    this.isLoading.set(true);
    this.viewMode.set('profile');
    // On récupère l'objet complet avec produits et stats depuis l'API
    this.moderationService.getVendorById(vendor.id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((data) => {
        this.selectedVendorData.set(data);
      });
      
  }

  closeView() {
    this.viewMode.set('list');
    this.selectedVendor.set(null);
  }

  async processValidation(status: 'approve' | 'reject') {
    const vendor = this.selectedVendor();
    let reason = '';

    if (status === 'reject') {
      const res = await this.alert.prompt('Rejet du dossier', `Indiquez le motif du refus pour ${vendor.name}`, 'Ex: Documents non conformes...');
      if (!res.confirmed) return;
      reason = res.value;
    } else {
      const ok = await this.alert.confirm('Valider la boutique', `Voulez-vous autoriser ${vendor.name} à vendre sur la plateforme ?`);
      if (!ok) return;
    }

    this.isLoading.set(true);
    this.moderationService.validateVendor(vendor.id, status, reason)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.show(`Traitement réussi`, 'success');
          this.loadVendors();
          this.closeView();
        }
      });
  }

  viewDoc(file: string) {
    if (file) window.open(`${environment.apiBaseUrl}/documents/${file}`, '_blank');
  }

  backFromProfil(){
    this.selectedVendorData.set(null); 
    this.viewMode.set('list')
  }
}