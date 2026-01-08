import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interface pour typer proprement nos permissions
interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PermissionGroup {
  module: string;
  icon: string;
  actions: Permission[];
}

interface Role {
  id: string;
  name: string;
  icon: string;
  groups: PermissionGroup[];
}

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roles-permissions.html'
})
export class RolesPermissions {
  // Liste des rôles disponibles
  roles = signal<Role[]>([
    {
      id: 'admin_finance',
      name: 'Comptable Senior',
      icon: 'payments',
      groups: [
        {
          module: 'Finance',
          icon: 'account_balance',
          actions: [
            { id: 'view_rev', name: 'Voir Revenus Mall', description: 'Accès aux graphiques de rentabilité globale.', enabled: true },
            { id: 'val_with', name: 'Valider Retraits', description: 'Autoriser les sorties de fonds vers les boutiques.', enabled: true },
            { id: 'edit_fees', name: 'Modifier Commissions', description: 'Changer les taux de taxe et commissions.', enabled: false }
          ]
        },
        {
          module: 'Sécurité',
          icon: 'shield',
          actions: [
            { id: 'view_logs', name: 'Audit Logs', description: 'Consulter l\'historique des actions du staff.', enabled: true }
          ]
        }
      ]
    },
    {
      id: 'moderator',
      name: 'Modérateur Contenu',
      icon: 'gavel',
      groups: [
        {
          module: 'Catalogue',
          icon: 'inventory_2',
          actions: [
            { id: 'app_prod', name: 'Approuver Produits', description: 'Valider les nouveaux articles des marchands.', enabled: true },
            { id: 'del_prod', name: 'Supprimer Produits', description: 'Retirer un article non conforme du Mall.', enabled: true }
          ]
        }
      ]
    }
  ]);

  // État de sélection
  selectedRoleId = signal<string | null>(null);

  // Sélecteur calculé pour obtenir l'objet rôle complet
  selectedRole = computed(() => 
    this.roles().find(r => r.id === this.selectedRoleId()) || null
  );

  // Récupérer uniquement les groupes de permissions du rôle sélectionné
  permissionGroups = computed(() => this.selectedRole()?.groups || []);

  /**
   * Sélectionne un rôle pour l'édition
   */
  selectRole(role: Role) {
    this.selectedRoleId.set(role.id);
  }

  /**
   * Bascule l'état d'une permission (Toggle)
   */
  togglePermission(groupIdx: number, actionIdx: number) {
    const currentRole = this.selectedRole();
    if (!currentRole) return;

    // Mise à jour immuable du signal
    this.roles.update(allRoles => {
      return allRoles.map(r => {
        if (r.id === currentRole.id) {
          const newGroups = [...r.groups];
          const newActions = [...newGroups[groupIdx].actions];
          
          // Inversion de l'état
          newActions[actionIdx] = { 
            ...newActions[actionIdx], 
            enabled: !newActions[actionIdx].enabled 
          };
          
          newGroups[groupIdx] = { ...newGroups[groupIdx], actions: newActions };
          return { ...r, groups: newGroups };
        }
        return r;
      });
    });
  }

  /**
   * Sauvegarde les modifications vers l'API
   */
  savePermissions() {
    const roleToSave = this.selectedRole();
    console.log('Envoi des nouvelles permissions pour :', roleToSave?.name, roleToSave?.groups);
    
    // Ici votre service API : this.apiService.updateRole(roleToSave)
    // this.toast.show('Permissions mises à jour avec succès', 'success');
  }
}