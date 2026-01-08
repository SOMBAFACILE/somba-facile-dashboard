import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

export interface ModerationDashboardData {
  kpis: {
    totalClients: number;
    totalVendors: number;
    totalOrders: number;
    pendingReports: number;
  };
  userDistribution: {
    labels: string[];
    data: number[];
  };
  pendingVendors: any[];
  recentReports: any[];
  recentOrders: any[];
}

@Injectable({ providedIn: 'root' })
export class ModerationService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin/moderator`;

  getDashboardData(): Observable<ModerationDashboardData> {
    return this.http.get<ModerationDashboardData>(`${this.API_URL}/dashboard-stats`);
  }

  approveVendor(id: number): Observable<any> {
    return this.http.post(`${this.API_URL}/vendors/${id}/approve`, {});
  }
  
  /**
   * Récupère la liste simplifiée des utilisateurs (pour le tableau principal)
   */
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/users`);
  }

  /**
   * Récupère les détails profonds d'un utilisateur :
   * Profil complet, Panier actuel, Historique commandes et Wallet
   */
  getUserFullDetails(userId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/users/${userId}/details`);
  }

  /**
   * Alterne l'état de l'utilisateur (Active ou Bloque le compte)
   */
  toggleUserStatus(userId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/users/${userId}/toggle-status`, {});
  }

  /**
   * Déclenche l'envoi d'un email de réinitialisation de mot de passe
   * à l'utilisateur ciblé.
   */
  resetPassword(userId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/users/${userId}/reset-password`, {});
  }

  /**
   * Optionnel : Bannir avec une raison spécifique
   */
  banUser(userId: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/users/${userId}/ban`, { reason });
  }

  unBanUser(userId: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/users/${userId}/ban`, { reason });
  }
    // À ajouter dans ton ModerationService existant
  // getVendorsByStatus(status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL') {
  //   if(status == "ALL") return this.http.get<any[]>(``);
  //   return this.http.get<any[]>(`${this.API_URL}/vendors/pending`); // Ton controller Symfony filtre déjà
  // }

/**
   * Récupère la liste des vendeurs.
   * @param status (Optionnel) 'PENDING', 'APPROVED', 'REJECTED' ou 'ALL' (défaut)
   */
  getVendors(status: string = 'ALL'): Observable<any[]> {
    let params = new HttpParams();
    
    // On n'envoie le paramètre status que s'il n'est pas 'ALL'
    if (status && status !== 'ALL') {
      params = params.set('status', status);
    }

    return this.http.get<any[]>(`${this.API_URL}/vendors`, { params });
  }

  /**
   * Valide ou Rejette un vendeur
   */
  validateVendor(id: number, action: 'approve' | 'reject', reason?: string|null): Observable<any> {
    const url = `${this.API_URL}/vendors/${id}/${action}`;
    // Si c'est un rejet, on envoie la raison dans le body
    const body = action === 'reject' ? { rejectionReason: reason } : {};
    
    return this.http.post(url, body);
  }
  
  getVendorById(id: number): Observable<any> {
    return this.http.get(`${this.API_URL}/vendors/${id}`);
  }
  /**
   * Récupère la liste de tous les produits pour la modération
   */
  getModerationProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/products`);
  }

  /**
   * Met à jour le statut d'un produit (BLOCKED, PUBLISHED, etc.)
   * @param id ID du produit
   * @param status Nouveau statut ('BLOCKED' | 'PUBLISHED')
   * @param reason (Optionnel) Raison du blocage
   */
  updateProductStatus(id: number, status: string, reason?: string): Observable<any> {
    const payload = { 
      status: status, 
      reason: reason ?? null 
    };
    return this.http.post(`${this.API_URL}/products/${id}/status`, payload);
  }


  getProductSocialDetails(productId: number): Observable<{reviews: any[], reports: any[]}> {
    return this.http.get<{reviews: any[], reports: any[]}>(`${this.API_URL}/products/${productId}/social-details`);
  }

  /**
   * Supprime définitivement un produit
   * @param id ID du produit
   */
  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/products/${id}`);
  }
/** * Récupère toutes les alertes (avis signalés et boutiques problématiques)
   */
  getReviewAlertsDashboard(): Observable<{ productReports: any[], vendorAlerts: any[] }> {
    return this.http.get<{ productReports: any[], vendorAlerts: any[] }>(`${this.API_URL}/reviews/dashboard`);
  }

  /**
   * Récupère le détail des avis et signalements pour un produit précis
   */
  getProductReviewDetails(productId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/reviews/product/${productId}`);
  }

  /**
   * Modère un avis client (ex: supprimer un avis injurieux)
   */
  moderateReview(reviewId: number, action: 'DELETE' | 'KEEP'): Observable<any> {
    return this.http.post(`${this.API_URL}/reviews/${reviewId}/action`, { action });
  }

  /**
   * Sanctionne une boutique (système de Strike) suite à des signalements
   */
  issueVendorStrike(vendorId: number, reason: string, productId?: number): Observable<any> {
    return this.http.post(`${this.API_URL}/vendors/${vendorId}/strike`, { reason, productId });
  }

  /**
   * Change le statut d'une boutique (ex: SUSPENDED)
   */
  updateVendorAccountStatus(vendorId: number, status: string): Observable<any> {
    return this.http.post(`${this.API_URL}/vendors/${vendorId}/account-status`, { status });
  }
}