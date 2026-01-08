import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fraud-monitor',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fraud-monitor.html'
})
export class FraudMonitor {
  alerts = signal([
    { type: 'Retraits Massifs', shop: 'Electro Hub', amount: '500,000 U', severity: 'Critique', time: '14:05' },
    { type: 'Ventes Inhabituelles', shop: 'Boutique Test', amount: '2,000,000 U', severity: 'Alerte', time: '12:40' }
  ]);
}