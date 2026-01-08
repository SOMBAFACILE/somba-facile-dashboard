import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sponsored-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sponsored-products.html'
})
export class SponsoredProducts {
  sponsoredItems = signal([
    { id: 1, name: 'iPhone 15 Pro', shop: 'Apple Reseller', bid: '500 U/jour', status: 'Actif' },
    { id: 2, name: 'Baskets Air Max', shop: 'Sport Gear', bid: '350 U/jour', status: 'Expiré' }
  ]);
}