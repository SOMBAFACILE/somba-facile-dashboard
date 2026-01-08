import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badges-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badges-management.html'
})
export class BadgesManagement {
  
  merchants = signal([
    { id: 1, name: 'Electro Store', sales: 1500, rating: 4.8, isVerified: true, isPremium: false },
    { id: 2, name: 'Bio Market', sales: 450, rating: 4.2, isVerified: false, isPremium: false },
    { id: 3, name: 'Luxe & Co', sales: 890, rating: 4.9, isVerified: true, isPremium: true }
  ]);

  toggleBadge(merchantId: number, type: 'isVerified' | 'isPremium') {
    this.merchants.update(list => list.map(m => {
      if (m.id === merchantId) {
        return { ...m, [type]: !m[type] };
      }
      return m;
    }));
  }
}