import { Routes } from '@angular/router';
import { Dashboard } from './pages/super-admin/dashboard/dashboard';
import { ModerationLayout } from './pages/moderateur/moderation-layout/moderation-layout';
import { ModerationDashboard } from './pages/moderateur/moderation-dashboard/moderation-dashboard';
import { UserList } from './pages/moderateur/user-list/user-list';
import { VendorList } from './pages/moderateur/vendor-list/vendor-list';
import { ContentManagement } from './pages/moderateur/content-management/content-management';
import { ReviewList } from './pages/moderateur/review-list/review-list';
import { OrderList } from './pages/moderateur/order-list/order-list';
import { DeliveryTracking } from './pages/moderateur/delivery-tracking/delivery-tracking';
import { DisputeList } from './pages/moderateur/dispute-list/dispute-list';
import { ReportList } from './pages/moderateur/report-list/report-list';
import { FinanceDashboard } from './pages/finance/finance-dashboard/finance-dashboard';
import { Withdrawals } from './pages/finance/withdrawals/withdrawals';
import { Recharges } from './pages/finance/recharges/recharges';
import { AuditLog } from './pages/finance/audit-log/audit-log';
import { WalletManagement } from './pages/finance/wallet-management/wallet-management';
import { CommissionSettings } from './pages/finance/commission-settings/commission-settings';
import { CashClosure } from './pages/finance/cash-closure/cash-closure';
import { Overview } from './pages/super-admin/overview/overview';
import { StaffList } from './pages/super-admin/governance/staff-list/staff-list';
import { RolesPermissions } from './pages/super-admin/governance/roles-permissions/roles-permissions';
import { AdminAuditLogs } from './pages/super-admin/governance/admin-audit-logs/admin-audit-logs';
import { KycApproval } from './pages/super-admin/merchants/kyc-approval/kyc-approval';
import { ContractsSettings } from './pages/super-admin/merchants/contracts-settings/contracts-settings';
import { BadgesManagement } from './pages/super-admin/merchants/badges-management/badges-management';
import { AdsCampaigns } from './pages/super-admin/marketing/ads-campaigns/ads-campaigns';
import { PushNotifications } from './pages/super-admin/marketing/push-notifications/push-notifications';
import { SponsoredProducts } from './pages/super-admin/marketing/sponsored-products/sponsored-products';
import { IpControl } from './pages/super-admin/security/ip-control/ip-control';
import { FraudMonitor } from './pages/super-admin/security/fraud-monitor/fraud-monitor';
import { BlacklistManager } from './pages/super-admin/security/blacklist-manager/blacklist-manager';
import { MaintenanceMode } from './pages/super-admin/systeme/maintenance-mode/maintenance-mode';
import { AppVersions } from './pages/super-admin/systeme/app-versions/app-versions';
import { GlobalParameters } from './pages/super-admin/systeme/global-parameters/global-parameters';
import { roleGuard } from './guards/auth.guard';
import { LoginComponent } from './auth/login/login';
import { Unauthorized } from './auth/unauthorized/unauthorized';

export const routes: Routes = [
    { 
        path: '', 
        component: LoginComponent,
        title: 'Connexion - Somba-Facile' 
    },

    {
        path: 'moderation',
        component: ModerationLayout, // Le layout avec la sidebar
        canActivate: [roleGuard(['ROLE_ADMIN', 'ROLE_MODERATOR'])],
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: ModerationDashboard },
            { path: 'users', component: UserList },          // Liste + Vue 360°
            { path: 'vendors', component: VendorList },       // Gestion des boutiques
            { path: 'content-manager', component: ContentManagement }, // Validation produits
            { path: 'reviews', component: ReviewList }, // Gestion des avis
            { path: 'orders', component: OrderList },     // Litiges clients/vendeurs
            { path: 'delivery-tracking', component: DeliveryTracking},
            { path: 'reports', component: ReportList }, // Rapports d'activité
            { path: 'disputes', component: DisputeList }, // Vue globale de toutes les transactions marchandes
        ]
    },
    {
        path: 'finance',
        component: ModerationLayout, // Un layout qui utilise le sidebar avec menuFinanceItems
        canActivate: [roleGuard(['ROLE_ADMIN', 'ROLE_FINANCE'])],
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            { path: 'overview', component: FinanceDashboard },
            { path: 'recharges', component: Recharges },
            { path: 'withdrawals', component: Withdrawals },
            { path: 'audit-log', component: AuditLog },
            { path: 'wallet-manager', component: WalletManagement },
            { path: 'commission-settings', component: CommissionSettings },
            { path: 'cash-closure', component: CashClosure },
        ]
    },
    {
        path: 'super-admin',
        component: ModerationLayout,
        canActivate: [roleGuard(['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'])],
        children: [
        { path: 'overview', component: Overview },
        
        // Groupe Équipe
        { path: 'staff', component: StaffList },
        { path: 'roles', component: RolesPermissions },
        { path: 'audit-admin', component: AdminAuditLogs },
        
        // Groupe Marchands
        { path: 'merchants-approval', component: KycApproval },
        { path: 'merchants-contracts', component: ContractsSettings },
        { path: 'merchants-badges', component: BadgesManagement },
        
        // Groupe Marketing/Pub
        { path: 'ads-campaigns', component: AdsCampaigns },
        { path: 'push-notifications', component: PushNotifications },
        { path: 'sponsored-items', component: SponsoredProducts },
        
        // Groupe Système
        { path: 'security-ips', component: IpControl },
        { path: 'fraud-detection', component: FraudMonitor },
        { path: 'blacklist', component: BlacklistManager },
        { path: 'maintenance', component: MaintenanceMode },
        { path: 'app-versions', component: AppVersions},
        { path: 'global-params', component: GlobalParameters},
        
        { path: '', redirectTo: 'overview', pathMatch: 'full' }
        ]
    },
    { 
        path: 'unauthorized', 
        component: Unauthorized 
    },
    // Fallback (404)
    { 
        path: '**', 
        redirectTo: '' 
    }
];
