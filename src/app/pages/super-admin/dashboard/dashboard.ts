import { Component, inject, signal } from '@angular/core';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { LayoutService } from '../../../services/layouts.service';
import { KapiCard, KpiStat } from '../../../components/kapi-card/kapi-card';
import { BaseChart } from '../../../components/base-chart/base-chart';
import { ChartData, ChartOptions } from 'chart.js';
import { ToastService } from '../../../services/toast.service';
import { AlertService } from '../../../services/alert.service';
import { TableAction, TableColumn } from '../../../models/table.model';
import { DataTable } from '../../../components/data-table/data-table';
import { UserDetail } from '../../../components/user-detail/user-detail';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, Header, KapiCard, BaseChart , DataTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  layoutService = inject(LayoutService);
  selectedUser = signal<any | null>(null);

// --- DONNÉES POUR LES CARTES KPI ---
  // On utilise des signals pour pouvoir les mettre à jour facilement plus tard
  public totalSales = signal({ value: '12,450 €', label: 'vs mois dernier', isPositive: true });
  public activeUsers = signal({ value: '1,200', label: 'utilisateurs actifs', isPositive: true });
  public bounceRate = signal({ value: '32.4%', label: 'taux de rebond', isPositive: false });

  // --- DONNÉES POUR LES GRAPHIQUES ---
  
  // 1. Données du graphique en barres
  public barChartData = signal<ChartData>({
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Visites',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: '#4F46E5', // Indigo
        borderRadius: 6,
      }
    ]
  });

  // 2. Données du graphique linéaire
  public lineChartData = signal<ChartData>({
    labels: ['Jan', 'Féb', 'Mar', 'Avr', 'Mai'],
    datasets: [
      {
        label: 'Revenus',
        data: [1200, 1900, 3000, 2500, 4200],
        borderColor: '#10B981', // Vert
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  });

  // Options communes ou spécifiques
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  // Dans votre dashboard.component.ts

  public comparisonData = signal<ChartData>({
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'], // L'axe X
    datasets: [
      {
        label: 'Dépôts',
        data: [1200, 1500, 1100, 1800, 2200, 2500],
        borderColor: '#10B981', // Vert
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      },
      {
        label: 'Retraits',
        data: [800, 900, 1400, 1200, 1000, 1900],
        borderColor: '#EF4444', // Rouge
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  });

  private toast = inject(ToastService);

  saveData() {
    // Choisir la position avant de montrer
    this.toast.position.set('bottom-left');
    
    // Afficher le toast
    this.toast.show('Données enregistrées avec succès !', 'success');
  }

  showError() {
    this.toast.position.set('top-center');
    this.toast.show('Erreur de connexion au serveur', 'error', 5000);
  }


  private alert = inject(AlertService);

  async openAlert() {
    const confirmed = await this.alert.confirm(
      'Supprimer l\'utilisateur ?',
      'Toutes les données liées seront perdues.'
    );

    if (confirmed) {
      // Logique de suppression ici
      this.alert.success('Supprimé !', 'L\'utilisateur a bien été retiré.');
    }
  }
userColumns: TableColumn[] = [
    { key: 'avatar', label: '', type: 'image' }, // Colonne image
    { key: 'name', label: 'Nom' },
    { key: 'status', label: 'Statut', type: 'badge' } // Badge auto-coloré
  ];

  // Définition des actions dynamiques
  userActions: TableAction[] = [
    { 
      label: 'Voir Profil', 
      icon: 'visibility', 
      callback: (user) => console.log('Détails de', user.name) 
    },
    { 
      label: 'Bannir', 
      icon: 'block', 
      color: 'text-orange-500',
      callback: (user) => this.alert.success('Bloqué', user.name + ' a été banni.')
    },
    { 
      label: 'Supprimer', 
      icon: 'delete', 
      color: 'text-red-500', 
      callback: async (user) => {
        const ok = await this.alert.confirm('Supprimer ?');
        if (ok) this.userData.update(list => list.filter(u => u.id !== user.id));
      }
    }
  ];

  userData = signal([
    { id: 1, name: 'Jean Dupont', avatar: 'https://i.pravatar.cc/150?u=1', status: 'Actif' },
    { id: 2, name: 'Marie Curie', avatar: 'https://i.pravatar.cc/150?u=2', status: 'Inactif' },
    { id: 3, name: 'Benoit XVI', avatar: 'https://i.pravatar.cc/150?u=3', status: 'Banni' }
  ]);



}
