import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTable } from '../../../../components/data-table/data-table';
import { TableAction, TableColumn } from '../../../../models/table.model';

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [CommonModule, DataTable],
  templateUrl: './staff-list.html'
})
export class StaffList {
  
  columns: TableColumn[] = [
    { key: 'fullname', label: 'Collaborateur' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Rôle / Niveau', type: 'badge' },
    { key: 'last_activity', label: 'Dernière activité' },
    { key: 'status', label: 'État', type: 'badge' }
  ];

  staffMembers = signal([
    { id: 1, fullname: 'Marc Kouassi', email: 'm.kouassi@mall.com', role: 'Comptable', last_activity: 'Il y a 5 min', status: 'Actif' },
    { id: 2, fullname: 'Sophie Traoré', email: 's.traore@mall.com', role: 'Modératrice', last_activity: 'Hier à 18h', status: 'Actif' },
    { id: 3, fullname: 'Kevin Bakayoko', email: 'k.bakayoko@mall.com', role: 'Support', last_activity: '2 jours', status: 'Suspendu' }
  ]);

  actions: TableAction[] = [
    { label: 'Éditer les droits', icon: 'security', callback: (staff) => this.editStaff(staff) },
    { label: 'Réinitialiser Accès', icon: 'lock_reset', callback: (staff) => this.resetAccess(staff) },
    { label: 'Suspendre', icon: 'block', color: 'text-red-600', callback: (staff) => this.toggleStatus(staff) }
  ];

  editStaff(staff: any) { /* Logique d'ouverture du modal d'édition */ }
  resetAccess(staff: any) { /* Envoi d'un mail de reset forcé */ }
  toggleStatus(staff: any) { /* Switch entre Actif / Suspendu */ }
}