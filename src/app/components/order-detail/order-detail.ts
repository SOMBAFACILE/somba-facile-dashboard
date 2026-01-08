import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KapiCard } from '../kapi-card/kapi-card';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-detail.html'
})
export class OrderDetail{
  order = input.required<any>(); // Reçoit l'objet commande sélectionné
  onBack = output<void>();

  // Timeline de livraison simulée
  timeline = signal([
    { status: 'Commande Placée', date: '25/12/2025 14:20', icon: 'shopping_cart', done: true },
    { status: 'Paiement Wallet Confirmé', date: '25/12/2025 14:22', icon: 'account_balance_wallet', done: true },
    { status: 'En préparation chez le vendeur', date: '25/12/2025 14:45', icon: 'inventory_2', done: true },
    { status: 'Récupéré par le livreur', date: '25/12/2025 15:10', icon: 'local_shipping', done: true },
    { status: 'En cours de route', date: '--:--', icon: 'near_me', done: false },
    { status: 'Livré', date: '--:--', icon: 'check_circle', done: false }
  ]);

  // Articles de la commande
  items = signal([
    { name: 'iPhone 15 Pro Max', qty: 1, price: '4500', vendor: 'Electro Plus', image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=50' },
    { name: 'Coque Silicone MagSafe', qty: 1, price: '150', vendor: 'Electro Plus', image: 'https://images.unsplash.com/photo-1603313011101-31c726a65a41?w=50' }
  ]);
}