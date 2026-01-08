import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ip-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ip-control.html'
})
export class IpControl {
  whitelistedIps = signal([
    { ip: '192.168.1.1', label: 'Bureau Principal', addedAt: '20 Oct 2023' },
    { ip: '41.202.45.10', label: 'VPN Sécurisé', addedAt: '22 Oct 2023' }
  ]);

  suspiciousAttempts = signal([
    { ip: '185.22.14.5', location: 'Russie', attempts: 14, lastAttempt: 'Il y a 2h' },
    { ip: '92.45.110.2', location: 'Inconnu', attempts: 5, lastAttempt: 'Il y a 10 min' }
  ]);

  blockIp(ip: string) {
    alert(`L'adresse IP ${ip} a été bannie définitivement.`);
  }
}