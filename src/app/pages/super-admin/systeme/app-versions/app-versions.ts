import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-versions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-versions.html'
})
export class AppVersions {
  platforms = signal([
    { name: 'iOS', currentVersion: '2.4.1', minVersion: '2.3.0', lastUpdate: '10/12/2025' },
    { name: 'Android', currentVersion: '2.4.5', minVersion: '2.4.0', lastUpdate: '15/12/2025' }
  ]);
}