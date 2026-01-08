import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { DataTable } from '../../../components/data-table/data-table';
import { TableColumn } from '../../../models/table.model';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, KapiCard, DataTable],
  templateUrl: './overview.html'
})
export class Overview {
  // Stats Globales (Le pouls du Mall Center)
  stats = signal({
    totalUsers: { value: '45,200', label: 'Utilisateurs Totaux', icon: 'people' },
    activeMerchants: { value: '128', label: 'Boutiques Actives', icon: 'storefront' },
    systemRevenue: { value: '2,450,000 U', label: 'Revenus (Commissions)', icon: 'payments' },
    serverHealth: { value: '99.9%', label: 'Uptime Système', icon: 'dns' }
  });

  // Colonnes pour les alertes de sécurité ou activités critiques
  columns: TableColumn[] = [
    { key: 'timestamp', label: 'Heure' },
    { key: 'event', label: 'Événement' },
    { key: 'user', label: 'Acteur' },
    { key: 'severity', label: 'Niveau', type: 'badge' }
  ];

  recentLogs = signal([
    { timestamp: '14:20', event: 'Tentative de connexion IP bloquée', user: 'Admin-System', severity: 'Critique' },
    { timestamp: '13:45', event: 'Nouvelle Boutique en attente KYC', user: 'System', severity: 'Info' },
    { timestamp: '12:10', event: 'Mise à jour taux commission (Électronique)', user: 'Jean (Manager)', severity: 'Alerte' },
  ]);

  getSeverityClass(severity: string) {
    switch (severity) {
      case 'Critique': return 'bg-red-100 text-red-700';
      case 'Alerte': return 'bg-amber-100 text-amber-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  }
}