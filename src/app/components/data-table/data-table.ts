import { Component, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn, TableAction } from '../../models/table.model';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html'
})
export class DataTable {
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  actions = input<TableAction[]>([]); // Les actions deviennent dynamiques
  itemsPerPage = input<number>(5);

  searchTerm = signal('');
  currentPage = signal(1);
  openDropdownId = signal<any | null>(null); // Pour savoir quel menu est ouvert

  // --- Logique Filtrage & Pagination (Identique à avant) ---
  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const rawData = this.data();
    if (!term) return rawData;
    return rawData.filter(item => 
      Object.values(item).some(val => String(val).toLowerCase().includes(term))
    );
  });

  paginatedData = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredData().slice(start, end);
  });

  totalPages = computed(() => Math.ceil(this.filteredData().length / this.itemsPerPage()));

  // --- Gestion du Dropdown ---
  toggleDropdown(id: any, event: Event) {
    event.stopPropagation();
    this.openDropdownId.update(current => current === id ? null : id);
  }

  // Helper pour les couleurs de badges dynamiques
  getBadgeClass(value: string): string {
    const v = value.toLowerCase();
    if (v === 'actif' || v === 'succès' || v === 'admin' || v == 'delivered') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
    if (v === 'inactif' || v === 'erreur' || v === 'banni' || v === 'Annulé' ) return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    if (v === 'pending' || v === "En attente" || v === 'user') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
  }

  updateSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.currentPage.set(1); // Reset à la page 1 lors d'une recherche
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.update(p => p + 1);
  }

  prevPage() {
    if (this.currentPage() > 1) this.currentPage.update(p => p - 1);
  }
}