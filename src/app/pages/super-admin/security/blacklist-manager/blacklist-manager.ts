import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blacklist-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blacklist-manager.html'
})
export class BlacklistManager {
  bannedItems = signal([
    { target: 'user_8842', reason: 'Fraude à la carte', type: 'Utilisateur', date: '15 Oct 2023' },
    { target: 'shop_vape_99', reason: 'Vente interdite', type: 'Boutique', date: '10 Oct 2023' }
  ]);
}