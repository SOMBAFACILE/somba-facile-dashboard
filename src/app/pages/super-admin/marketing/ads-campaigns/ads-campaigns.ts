import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ads-campaigns',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ads-campaigns.html'
})
export class AdsCampaigns {
  campaigns = signal([
    { id: 1, title: 'Soldes Été 2024', shop: 'Fashion Store', views: 12500, clicks: 840, status: 'Active', image: 'banner1.jpg' },
    { id: 2, title: 'Nouveautés Tech', shop: 'Giga Electrics', views: 8200, clicks: 310, status: 'Programmée', image: 'banner2.jpg' }
  ]);

  showModal = signal(false);

  toggleCampaignStatus(id: number) {
    this.campaigns.update(list => list.map(c => 
      c.id === id ? { ...c, status: c.status === 'Active' ? 'Pause' : 'Active' } : c
    ));
  }
}