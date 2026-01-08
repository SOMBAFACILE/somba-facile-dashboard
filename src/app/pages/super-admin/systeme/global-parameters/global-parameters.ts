import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-global-parameters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './global-parameters.html'
})
export class GlobalParameters {
  config = signal({
    mallName: 'Kapi Mall Center',
    supportEmail: 'contact@kapi-mall.com',
    currency: 'U',
    timezone: 'UTC+1',
    maxImageSize: 5 // MB
  });
}