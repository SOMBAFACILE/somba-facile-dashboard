import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../../../components/data-table/data-table';
import { TableColumn } from '../../../../models/table.model';

@Component({
  selector: 'app-admin-audit-logs',
  standalone: true,
  imports: [CommonModule, DataTable],
  templateUrl: './admin-audit-logs.html'
})
export class AdminAuditLogs {
  
  // Configuration des colonnes
  columns: TableColumn[] = [
    { key: 'timestamp', label: 'Date & Heure' },
    { key: 'admin', label: 'Administrateur' },
    { key: 'action', label: 'Action effectuée' },
    { key: 'module', label: 'Module', type: 'badge' },
    { key: 'target', label: 'Cible (ID/Nom)' },
    { key: 'ip', label: 'Adresse IP' }
  ];

  // Données de démo (Simulant le retour d'une API)
  auditLogs = signal([
    { 
      timestamp: '2023-10-25 14:30:05', 
      admin: 'Marc Kouassi', 
      action: 'Modification Taux Commission', 
      module: 'Finance', 
      target: 'Catégorie Électronique',
      ip: '192.168.1.45'
    },
    { 
      timestamp: '2023-10-25 13:15:22', 
      admin: 'Sophie Traoré', 
      action: 'Validation Boutique KYC', 
      module: 'Marchands', 
      target: 'Boulangerie Centrale',
      ip: '102.16.5.12'
    },
    { 
      timestamp: '2023-10-25 10:05:00', 
      admin: 'Kevin Bakayoko', 
      action: 'Suppression Produit', 
      module: 'Catalogue', 
      target: 'iPhone 13 Pro (ID: 554)',
      ip: '197.231.10.8'
    }
  ]);

  // Filtres
  selectedModule = signal('Tous');
  modules = ['Tous', 'Finance', 'Marchands', 'Catalogue', 'Sécurité', 'Marketing'];
}