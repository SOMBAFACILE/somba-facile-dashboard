import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataTable } from '../../../components/data-table/data-table';
import { TableColumn, TableAction } from '../../../models/table.model';
import { ProductPreviewModal } from '../../../components/modals/product-preview-modal/product-preview-modal';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { ModerationService } from '../../../services/API/moderation.service'; 
import { ToastService } from '../../../services/toast.service';
import { finalize } from 'rxjs';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-content-management',
  standalone: true,
  imports: [CommonModule, DataTable, ProductPreviewModal, KapiCard, FormsModule],
  templateUrl: './content-management.html'
})
export class ContentManagement implements OnInit {
  private contentService = inject(ModerationService);
  private toast = inject(ToastService);

  // --- Données et État ---
  public isLoading = signal(false);
  public allProducts = signal<any[]>([]);
  public selectedProduct = signal<any | null>(null);

  // --- Filtres ---
  public searchQuery = signal('');
  public statusFilter = signal('Tous');
  public categoryFilter = signal('Toutes');

  // --- Configuration Table ---
  productColumns: TableColumn[] = [
    { key: 'image', label: '', type: 'image' },
    { key: 'name', label: 'Produit' },
    { key: 'vendor', label: 'Boutique' },
    { key: 'category', label: 'Catégorie' },
    { key: 'price', label: 'Prix', type: 'currency' },
    { key: 'status', label: 'Statut', type: 'badge' }
  ];

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.isLoading.set(true);
    this.contentService.getModerationProducts()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data) => this.allProducts.set(data),
        error: () => this.toast.show('Erreur de chargement', 'error')
      });
  }

  // --- Logique Dynamique (Computed) ---

  /**
   * 1. Extraction dynamique des catégories uniques présentes dans la BDD (via les produits chargés)
   */
  public categories = computed(() => {
    const rawCategories = this.allProducts().map(p => p.category).filter(c => !!c);
    return ['Toutes', ...new Set(rawCategories)];
  });

  /**
   * 2. Filtrage de la liste
   */
  public filteredProducts = computed(() => {
    return this.allProducts().filter(p => {
      const matchesSearch = !this.searchQuery() || 
        p.name.toLowerCase().includes(this.searchQuery().toLowerCase()) || 
        p.vendor?.toLowerCase().includes(this.searchQuery().toLowerCase());
      
      const matchesStatus = this.statusFilter() === 'Tous' || p.status === this.statusFilter();
      const matchesCategory = this.categoryFilter() === 'Toutes' || p.category === this.categoryFilter();
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  });

  /**
   * 3. KPIs Améliorés
   */
  public kpis = computed(() => {
    const total = this.allProducts().length;
    const published = this.allProducts().filter(p => p.status === 'published').length;
    const blocked = this.allProducts().filter(p => p.status === 'BLOCKED').length;
    const pending = this.allProducts().filter(p => p.status === 'pending').length;

    return [
      { 
        label: 'Catalogue Actif', 
        value: published, 
        icon: 'check_circle', 
        color: 'text-green-600',
        subValue: `${((published/total)*100).toFixed(0)}% du total` 
      },
      { 
        label: 'En attente / Nouveaux', 
        value: pending, 
        icon: 'hourglass_empty', 
        color: 'text-orange-500',
        subValue: 'À vérifier'
      },
      { 
        label: 'Produits Bloqués', 
        value: blocked, 
        icon: 'block', 
        color: 'text-red-600',
        subValue: 'Hors ligne'
      }
    ];
  });

  productActions: TableAction[] = [
    { label: 'Inspecter', icon: 'visibility', callback: (p) => this.selectedProduct.set(p) }
  ];

// --- GESTION DES ÉVÉNEMENTS DU MODAL ---

  // 1. Bloquer un produit
  handleBlock(event: {id: number, reason: string}) {
    this.isLoading.set(true);
    this.contentService.updateProductStatus(event.id, 'BLOCKED', event.reason)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.show('Produit bloqué et retiré de la vente', 'success');
          this.selectedProduct.set(null); // Fermer le modal
          this.loadProducts(); // Rafraîchir la liste
        },
        error: () => this.toast.show('Erreur lors du blocage', 'error')
      });
  }

  // 2. Débloquer un produit
  handleUnblock(event: {id: number}) {
    this.isLoading.set(true);
    this.contentService.updateProductStatus(event.id, 'PUBLISHED')
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.show('Produit remis en ligne', 'success');
          this.selectedProduct.set(null);
          this.loadProducts();
        }
      });
  }

  // 3. Supprimer un produit
  handleDelete(event: {id: number}) {
    this.isLoading.set(true);
    this.contentService.deleteProduct(event.id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.toast.show('Produit supprimé définitivement', 'info');
          this.selectedProduct.set(null);
          this.loadProducts();
        }
      });
  }
}