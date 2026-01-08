import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../../components/data-table/data-table';
import { TableColumn, TableAction } from '../../../models/table.model';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { ReportDetail } from '../../../components/report-detail/report-detail';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, DataTable, KapiCard, ReportDetail],
  templateUrl: './report-list.html'
})
export class ReportList {
  SelectedReport = signal<any>(null);

  reportColumns: TableColumn[] = [
    { key: 'date', label: 'Date' },
    { key: 'targetType', label: 'Type Cible' },
    { key: 'targetName', label: 'Élément Signalé' },
    { key: 'reason', label: 'Motif' },
    { key: 'reporter', label: 'Par' },
    { key: 'status', label: 'Statut', type: 'badge' }
  ];

  reports = signal([
    { id: 1, date: '25/12 09:00', targetType: 'Avis', targetName: 'Commentaire #44', reason: 'Propos injurieux', reporter: 'User_88', status: 'En attente' },
    { id: 2, date: '25/12 10:30', targetType: 'Boutique', targetName: 'Fast Fashion', reason: 'Contrefaçon suspectée', reporter: 'User_12', status: 'Investig.' }
  ]);

  reportActions: TableAction[] = [
    { label: 'Voir le détail', icon: 'visibility', callback: (r) => this.SelectedReport.set(r) },
    { label: 'Supprimer l\'élément', icon: 'delete', color: 'text-red-600', callback: (r) => {} },
    { label: 'Ignorer', icon: 'done', callback: (r) => {} }
  ];
}