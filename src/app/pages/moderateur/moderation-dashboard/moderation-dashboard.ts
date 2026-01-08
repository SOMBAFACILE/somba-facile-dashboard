import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { BaseChart } from '../../../components/base-chart/base-chart';
import { DataTable } from '../../../components/data-table/data-table';
import { ChartData, ChartOptions } from 'chart.js';
import { TableAction, TableColumn } from '../../../models/table.model';
import { LayoutService } from '../../../services/layouts.service';
import { AlertService } from '../../../services/alert.service';
import { ModerationService } from '../../../services/API/moderation.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-moderation-dashboard',
  standalone: true,
  imports: [CommonModule, KapiCard, BaseChart, DataTable],
  templateUrl: './moderation-dashboard.html'
})
export class ModerationDashboard implements OnInit {
  // Injections
  layoutService = inject(LayoutService);
  alert = inject(AlertService);
  private moderationService = inject(ModerationService);

  // État de chargement
  public isLoading = signal<boolean>(true);

  // KPI (initialisés à 0)
  public kpis = signal<any>({ 
    totalClients: 0, 
    totalVendors: 0, 
    totalOrders: 0, 
    pendingReports: 0 
  });

  // Données Graphique (Typage strict pour éviter TS2322)
  public userDistributionData = signal<ChartData>({
    labels: ['Clients', 'Vendeurs', 'Livreurs'],
    datasets: [{
      data: [0, 0, 0],
      backgroundColor: ['#4F46E5', '#F59E0B', '#EF4444'],
      borderWidth: 0
    }]
  });

  public doughnutOptions: ChartOptions = {
    plugins: { legend: { position: 'bottom' } },
    responsive: true,
    maintainAspectRatio: false
  };

  // Configuration du Tableau des Commandes
  public orderColumns: TableColumn[] = [
    { key: 'id', label: 'Réf' },
    { key: 'customer', label: 'Client' },
    { key: 'totalAmount', label: 'Montant', type: 'currency' },
    { key: 'status', label: 'Statut', type: 'badge' },
    { key: 'createdAt', label: 'Date', type: 'date' }
  ];

  public Actions: TableAction[] = [
    { 
      label: 'Détails', 
      icon: 'visibility', 
      callback: (order) => console.log('Voir commande', order.id) 
    },
    { 
      label: 'Annuler', 
      icon: 'close', 
      color: 'text-red-500', 
      callback: async (order) => {
        const ok = await this.alert.confirm('Annuler cette commande ?');
        if (ok) console.log('Action annulée pour', order.id);
      }
    }
  ];

  // Données des listes
  public recentOrders = signal<any[]>([]);
  public recentReports = signal<any[]>([]);
  public pendingVendors = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this.moderationService.getDashboardData()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.kpis.set(res.kpis);
          this.recentOrders.set(res.recentOrders);
          this.recentReports.set(res.recentReports);
          this.pendingVendors.set(res.pendingVendors);
          
          // Mise à jour propre du graphique
          this.userDistributionData.set({
            labels: res.userDistribution.labels,
            datasets: [{
              ...this.userDistributionData().datasets[0],
              data: res.userDistribution.data
            }]
          });
        },
        error: (err) => {
          this.alert.error('Erreur', 'Impossible de charger les statistiques.');
          console.error(err);
        }
      });
  }

  validateVendor(id :any){
    this.alert.confirm('Approbation de compte', "voullez vous vraimment approuver ce compte")
  }
}