import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-maintenance-mode',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './maintenance-mode.html'
})
export class MaintenanceMode {
  
  isMaintenanceActive = signal(false);
  maintenanceMessage = signal('Le Mall Center est actuellement en maintenance pour amélioration. Revenez dans quelques minutes !');
  estimatedEndTime = signal('12:00');

  toggleMaintenance() {
    this.isMaintenanceActive.update(v => !v);
    const status = this.isMaintenanceActive() ? 'ACTIVÉE' : 'DÉSACTIVÉE';
    console.log(`Maintenance ${status}`);
  }
}