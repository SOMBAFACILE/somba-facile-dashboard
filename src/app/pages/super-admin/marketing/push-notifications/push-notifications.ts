import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-push-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './push-notifications.html'
})
export class PushNotifications {
  targetOptions = ['Tous les utilisateurs', 'Clients Fidèles', 'Inactifs (30j)', 'Vendeurs uniquement'];
  
  message = signal({
    title: '',
    body: '',
    target: 'Tous les utilisateurs'
  });

  sendPush() {
    console.log('Push envoyé :', this.message());
    alert('Notification envoyée avec succès !');
  }
}