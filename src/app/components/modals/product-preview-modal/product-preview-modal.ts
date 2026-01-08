import { Component, input, output, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModerationService } from '../../../services/API/moderation.service';

@Component({
  selector: 'app-product-preview-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-preview-modal.html'
})
export class ProductPreviewModal implements OnInit {
  private moderationService = inject(ModerationService);

  product = input.required<any>();
  onClose = output<void>();
  onBlock = output<{id: number, reason: string}>();
  onUnblock = output<{id: number}>();
  onDelete = output<{id: number}>();

  // Gestion des onglets
  activeTab = signal<'infos' | 'reviews' | 'reports'>('infos');
  
  // Données sociales
  socialData = signal<{reviews: any[], reports: any[]}>({ reviews: [], reports: [] });
  isLoadingSocial = signal(false);

  ngOnInit() {
    this.loadSocialContent();
  }

  loadSocialContent() {
    this.isLoadingSocial.set(true);
    // Appel API spécifique pour les avis et signalements de ce produit
    this.moderationService.getProductSocialDetails(this.product().id).subscribe({
      next: (data) => {
        this.socialData.set(data);
        this.isLoadingSocial.set(false);
      },
      error: () => this.isLoadingSocial.set(false)
    });
  }

  // État local pour l'interface de blocage
  isBlockingMode = signal(false);
  blockReason = signal('');

  // Helper pour savoir si le produit est actuellement bloqué
  isBlocked = computed(() => this.product().status === 'BLOCKED');

  confirmBlock() {
    if (this.blockReason().trim().length < 5) return;
    this.onBlock.emit({ 
      id: this.product().id, 
      reason: this.blockReason() 
    });
  }

  handleDelete() {
    if(confirm('Êtes-vous sûr de vouloir supprimer définitivement ce produit ? Cette action est irréversible.')) {
      this.onDelete.emit({ id: this.product().id });
    }
  }
}