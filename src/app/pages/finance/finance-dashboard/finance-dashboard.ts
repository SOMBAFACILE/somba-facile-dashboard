import { Component, inject, signal } from '@angular/core';
import { Sidebar } from '../../../components/sidebar/sidebar';
import { Header } from '../../../components/header/header';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { BaseChart } from '../../../components/base-chart/base-chart';
import { DataTable } from '../../../components/data-table/data-table';
import { ChartData, ChartOptions } from 'chart.js';
import { TableColumn, TableAction } from '../../../models/table.model';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [KapiCard, BaseChart, DataTable],
  templateUrl: './finance-dashboard.html',
})
export class FinanceDashboard {
  // --- KPIs FINANCIERS ---
  // Utilisation de vos Units (U)
  public totalLiquidity = signal({ value: '1,250,000 U', label: 'Masse monétaire totale', isPositive: true });
  public pendingWithdrawals = signal({ value: '45,000 U', label: '8 demandes en attente', isPositive: false });
  public netCommissions = signal({ value: '125,400 U', label: 'Revenus plateforme', isPositive: true });

  // --- GRAPHIQUE : FLUX MONÉTAIRES ---
  public cashFlowData = signal<ChartData>({
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Entrées (Recharges)',
        data: [5000, 7000, 4500, 9000, 12000, 15000, 11000],
        borderColor: '#10B981', 
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Sorties (Retraits)',
        data: [3000, 4000, 8000, 5000, 4000, 9000, 7000],
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  });

  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: true, position: 'top' } },
    scales: { y: { beginAtZero: true }, x: { grid: { display: false } } }
  };

  // --- TABLEAU : DERNIÈRES TRANSACTIONS (AUDIT) ---
  transactionColumns: TableColumn[] = [
    { key: 'date', label: 'Date' },
    { key: 'user', label: 'Utilisateur' },
    { key: 'type', label: 'Type', type: 'badge' },
    { key: 'amount', label: 'Montant' },
    { key: 'status', label: 'Statut', type: 'badge' }
  ];

  transactions = signal([
    { id: 1, date: '2023-10-24 14:30', user: 'Abel K.', type: 'Recharge', amount: '+500 U', status: 'Succès' },
    { id: 2, date: '2023-10-24 15:10', user: 'Boutique Alpha', type: 'Retrait', amount: '-2,500 U', status: 'En attente' },
    { id: 3, date: '2023-10-24 16:05', user: 'Cédric M.', type: 'Achat', amount: '-150 U', status: 'Succès' }
  ]);
}