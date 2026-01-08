import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../../../components/data-table/data-table';
import { TableAction, TableColumn } from '../../../../models/table.model';

@Component({
  selector: 'app-kyc-approval',
  standalone: true,
  imports: [CommonModule, DataTable],
  templateUrl: './kyc-approval.html'
})
export class KycApproval {
  
  columns: TableColumn[] = [
    { key: 'shop_name', label: 'Boutique' },
    { key: 'owner', label: 'Propriétaire' },
    { key: 'doc_type', label: 'Document fourni' },
    { key: 'submitted_at', label: 'Date soumission' },
    { key: 'status', label: 'État', type: 'badge' }
  ];

  pendingRequests = signal([
    { id: 101, shop_name: 'Brico Max', owner: 'Amadou Diallo', doc_type: 'Registre Commerce', submitted_at: '24 Oct 2023', status: 'En attente' },
    { id: 102, shop_name: 'Fashion K', owner: 'Karine Mensah', doc_type: 'Pièce d\'identité', submitted_at: '25 Oct 2023', status: 'En attente' }
  ]);

  actions: TableAction[] = [
    { label: 'Examiner', icon: 'visibility', callback: (req) => this.viewDetails(req) },
    { label: 'Approuver', icon: 'check_circle', color: 'text-emerald-600', callback: (req) => this.approve(req) },
    { label: 'Rejeter', icon: 'cancel', color: 'text-red-600', callback: (req) => this.reject(req) }
  ];

  viewDetails(req: any) { console.log('Ouverture du document PDF...'); }
  
  approve(req: any) {
    // Logique API pour activer la boutique
    this.pendingRequests.update(list => list.filter(r => r.id !== req.id));
  }

  reject(req: any) {
    // Logique API pour notifier le rejet
  }
}