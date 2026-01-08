import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KapiCard } from '../../../components/kapi-card/kapi-card';
import { DataTable } from '../../../components/data-table/data-table';
import { TableColumn, TableAction } from '../../../models/table.model';
import { UserDetail } from '../../../components/user-detail/user-detail';
import { AlertService } from '../../../services/alert.service';
import { ToastService } from '../../../services/toast.service';
import { finalize } from 'rxjs';
import { ModerationService } from '../../../services/API/moderation.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, KapiCard, DataTable, UserDetail],
  templateUrl: './user-list.html'
})
export class UserList implements OnInit {
  private userService = inject(ModerationService);
  private alert = inject(AlertService);
  private toast = inject(ToastService);

  // --- États ---
  public isLoading = signal(false);
  public selectedUser = signal<any | null>(null);
  private allUsers = signal<any[]>([]);

  // --- Filtres ---
  searchTerm = signal('');
  dateDebut = signal('');
  dateFin = signal('');
  statutFiltre = signal('Tous');

  // --- Configuration Tableau ---
  userColumns: TableColumn[] = [
    { key: 'avatar', label: '', type: 'image' },
    { key: 'fullName', label: 'Nom & Prénom' },
    { key: 'email', label: 'Email' },
    { key: 'walletBalance', label: 'Solde Wallet', type:'currency' },
    { key: 'createdAt', label: 'Date Inscr.', type: 'date' },
    { key: 'status', label: 'Statut', type: 'badge' }
  ];

  userActions: TableAction[] = [
    { 
      label: 'Voir Profil', 
      icon: 'visibility', 
      callback: (user) => this.selectedUser.set(user) 
    },
    { 
      label: 'Bannir', 
      icon: 'block', 
      color: 'text-red-500', 
      callback: (user) => this.confirmBan(user) 
    }
  ];

  ngOnInit() {
    this.fetchUsers();
  }

  fetchUsers() {
    this.isLoading.set(true);
    this.userService.getUsers()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (users) => {
          console.log(users);
          const mapped = users.map(u => ({
            ...u,
            fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.username,
            walletBalance: u.sombaWallet ? u.sombaWallet.balance : 0,
            status: u.isBanned ? 'Bloqué' : 'Actif',
            avatar: u.profileImageName ? `${environment.ProfilApi}/u.profileImageName` : './illustrations/default-avatar.png'
          }));
          this.allUsers.set(mapped);
          this.toast.show('Données synchronisées','success');
        },
        error: () => this.alert.error('Erreur', 'Impossible de récupérer la liste des utilisateurs')
      });
  }

  // --- Filtrage Dynamique ---
  public filteredUsers = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const status = this.statutFiltre();
    const start = this.dateDebut();
    const end = this.dateFin();

    return this.allUsers().filter(user => {
      const matchesSearch = user.fullName.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
      const matchesStatus = status === 'Tous' || user.status === status;
      const matchesDate = (!start || user.createdAt >= start) && (!end || user.createdAt <= end);
      return matchesSearch && matchesStatus && matchesDate;
    });
  });

  // --- KPIs Dynamiques ---
  public kpis = computed(() => [
    { label: 'Comptes Actifs', value: this.allUsers().filter(u => u.status === 'Actif').length, icon: 'person', color: 'text-green-600' },
    { label: 'Comptes Bloqués', value: this.allUsers().filter(u => u.status === 'Bloqué').length, icon: 'block', color: 'text-red-600' },
    { label: 'Total Inscrits', value: this.allUsers().length, icon: 'groups', color: 'text-blue-600' }
  ]);

  async confirmBan(user: any) {
    const ok = await this.alert.confirm('Bannir l\'utilisateur ?', `Voulez-vous vraiment bloquer ${user.fullName} ?`);
    if (ok) {
      this.isLoading.set(true);
      this.userService.banUser(user.id, 'Violation des CGU')
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            this.toast.show('Utilisateur banni avec succès','success');
            this.fetchUsers();
          },
          error: () => this.toast.show('Échec de l\'opération','error')
        });
    }
  }
}