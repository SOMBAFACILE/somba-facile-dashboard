import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface KpiStat {
  value: string | number;
  label: string;
  isPositive: boolean; // Pour la couleur verte ou rouge
}

@Component({
  selector: 'app-kapi-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kapi-card.html'
})
export class KapiCard {
  // Paramètres d'entrée (Signal Inputs)
  title = input.required<string>();
  value = input.required<string | number>();
  icon = input<string>('trending_up');
  
  // Statistiques optionnelles
  stat = input<KpiStat | null>(null);

  // Personnalisation des couleurs (avec valeurs par défaut)
  bgColor = input<string>('bg-surface-light dark:bg-surface-dark');
  borderColor = input<string>('border-border-light dark:border-border-dark');
  accentColor = input<string>('text-primary');

  // Logique calculée pour l'icône de tendance
  trendIcon = computed(() => {
    const s = this.stat();
    if (!s) return '';
    return s.isPositive ? 'north' : 'south';
  });
}