import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../services/layouts.service';
import { AuthService } from '../../services/API/auth.service';

// Interface définie localement (ou importée)
export interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  id?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule], // RouterLink si tu utilises le routing Angular
  templateUrl: './sidebar.html' // On sépare le HTML pour la lisibilité ici
})
export class Sidebar {
  layoutService = inject(LayoutService);
  authService = inject(AuthService);
  

  // On crée un booléen réactif qui vérifie les deux rôles
  IsModerator = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.roles.some((r: any) => ['ROLE_ADMIN', 'ROLE_MODERATOR'].includes(r)) : false;
  });
  IsFinanceModerator = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.roles.some((r: any) => ['ROLE_ADMIN', 'ROLE_FINANCE'].includes(r)) : false;
  });

  IsSuperAdmin = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.roles.some((r: any) => ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'].includes(r)) : false;
  });

  // 1. Définition des items du menu
  // Menu dédié à la Finance
  menuFinanceItems = signal<MenuItem[]>([
    {
      label: 'Dashboard Financier',
      icon: 'account_balance',
      route: '/finance/overview'
    },
    {
      id: 'cash-in',
      label: 'Flux Entrants',
      icon: 'add_card',
      children: [
        { label: 'Recharges Wallet', icon: 'account_balance_wallet', route: '/finance/recharges' },
        { label: 'Dépôts Manuels', icon: 'payments', route: '/finance/manual-deposits' },
      ]
    },
    {
      id: 'cash-out',
      label: 'Flux Sortants',
      icon: 'outbound',
      children: [
        { label: 'Demandes de Retrait', icon: 'pending_actions', route: '/finance/withdrawals' },
        { label: 'Paiements Effectués', icon: 'check_circle', route: '/finance/payout-history' },
      ]
    },
    {
      id: 'audit',
      label: 'Contrôle & Audit',
      icon: 'history_edu',
      children: [
        { label: 'gestionnaire de wallet', icon: 'settings_input_component', route: '/finance/wallet-manager' },
        { label: 'parametres des commission', icon: '', route: "/finance/commission-settings"},
        { label: 'fermeture de caisse', icon:'', route: '/finance/cash-closure'},
        { label: 'Journal des Transactions', icon: 'list_alt', route: '/finance/audit-log' },
      ]
    }
  ]);

  // Dans moderation-layout.component.ts ou un service de menu
  menuModerateurItems = signal<MenuItem[]>([
    {
      label: 'Tableau de Bord',
      icon: 'dashboard',
      route: '/moderation/overview'
    },
    {
      id: 'actors',
      label: 'Communauté',
      icon: 'groups',
      children: [
        { label: 'Utilisateurs', icon: 'person', route: '/moderation/users' },
        { label: 'Boutiques', icon: 'storefront', route: '/moderation/vendors' },
      ]
    },
    {
      id: 'content',
      label: 'Contenu',
      icon: 'content_copy',
      children: [
        { label: 'Validation Produits', icon: 'fact_check', route: '/moderation/content-manager' },
        { label: 'Avis & Notes', icon: 'rate_review', route: '/moderation/reviews' },
      ]
    },
    {
      id: 'sales',
      label: 'Flux Marchand',
      icon: 'shopping_cart',
      children: [
        { label: 'Toutes les Commandes', icon: 'receipt_long', route: '/moderation/orders' },
        { label: 'Suivi Livraisons', icon: 'local_shipping', route: '/moderation/delivery-tracking' },
      ]
    },
    {
      id: 'security',
      label: 'Sécurité & Litiges',
      icon: 'gavel',
      children: [
        { label: 'Tickets ouverts', icon: 'confirmation_number', route: '/moderation/disputes' },
        { label: 'Signalements', icon: 'report', route: '/moderation/reports' },
      ]
    }
  ]);

  // Définition des items du menu Super Admin
  menuSuperAdminItems = signal<MenuItem[]>([
    {
      label: 'Tableau de Bord',
      icon: 'analytics',
      route: '/super-admin/overview'
    },
    {
      id: 'governance',
      label: 'Gouvernance',
      icon: 'admin_panel_settings',
      children: [
        { label: 'Gestion du Staff', icon: 'badge', route: '/super-admin/staff' },
        { label: 'Rôles & Droits', icon: 'security', route: '/super-admin/roles' },
        { label: 'Logs d\'Audit Admin', icon: 'history_edu', route: '/super-admin/audit-admin' },
      ]
    },
    {
      id: 'merchants_ops',
      label: 'Ecosystème Marchand',
      icon: 'store',
      children: [
        { label: 'Validation (KYC)', icon: 'how_to_reg', route: '/super-admin/merchants-approval' },
        { label: 'Certifications VIP', icon: 'verified', route: '/super-admin/merchants-badges' },
        { label: 'Contrats & Frais', icon: 'description', route: '/super-admin/merchants-contracts' },
      ]
    },
    {
      id: 'marketing_ads',
      label: 'Régie Publicitaire',
      icon: 'campaign',
      children: [
        { label: 'Campagnes Bannières', icon: 'add_photo_alternate', route: '/super-admin/ads-campaigns' },
        { label: 'Notifications Push', icon: 'notifications_active', route: '/super-admin/push-notifications' },
        { label: 'Produits Sponsorisés', icon: 'auto_awesome', route: '/super-admin/sponsored-items' },
      ]
    },
    {
      id: 'cyber_security',
      label: 'Haute Sécurité',
      icon: 'shield',
      children: [
        { label: 'Contrôle des IPs', icon: 'lan', route: '/super-admin/security-ips' },
        { label: 'Anti-Fraude', icon: 'psychology_alt', route: '/super-admin/fraud-detection' },
        { label: 'Bannissements', icon: 'block', route: '/super-admin/blacklist' },
      ]
    },
    {
      id: 'system_config',
      label: 'Configuration',
      icon: 'settings_suggest',
      children: [
        { label: 'Maintenance Mode', icon: 'construction', route: '/super-admin/maintenance' },
        { label: 'Versions de l\'App', icon: 'system_update_alt', route: '/super-admin/app-versions' },
        { label: 'Paramètres Globaux', icon: 'tune', route: '/super-admin/global-params' },
      ]
    }
  ]);

  // 2. Gestion de l'état : Quels menus sont ouverts ?
  // On utilise un Set pour stocker les IDs des menus ouverts (ex: Set{'drawer', 'module1'})
  openMenus = signal<Set<string>>(new Set(['drawer'])); 

  // Action : Basculer l'état d'un menu
  toggleMenu(id: string | undefined) {
    if (!id) return; // Sécurité si l'ID manque

    this.openMenus.update(currentSet => {
      const newSet = new Set(currentSet); // Copie pour immuabilité
      if (newSet.has(id)) {
        newSet.delete(id); // Fermer
      } else {
        newSet.add(id); // Ouvrir
      }
      return newSet;
    });
  }

  // Helper pour le template : Est-ce que ce menu est ouvert ?
  isOpen(id: string | undefined): boolean {
    return id ? this.openMenus().has(id) : false;
  }
}