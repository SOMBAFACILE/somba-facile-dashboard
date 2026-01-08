import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FeeContract {
  id: number;
  shopName: string;
  category: string;
  commissionRate: number; // en %
  fixedFee: number;      // frais fixe par vente
  withdrawFee: number;   // frais de retrait
  status: 'Standard' | 'Premium' | 'Négocié';
}

@Component({
  selector: 'app-contracts-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contracts-settings.html'
})
export class ContractsSettings {
  
  // Paramètres globaux par défaut
  globalSettings = signal({
    defaultCommission: 10,
    minWithdrawAmount: 5000,
    platformTax: 2
  });

  // Liste des contrats spécifiques par boutique
  contracts = signal<FeeContract[]>([
    { id: 1, shopName: 'Electro World', category: 'Électronique', commissionRate: 8, fixedFee: 50, withdrawFee: 1, status: 'Négocié' },
    { id: 2, shopName: 'Moda Style', category: 'Mode', commissionRate: 12, fixedFee: 0, withdrawFee: 2, status: 'Standard' },
    { id: 3, shopName: 'Super Food', category: 'Alimentation', commissionRate: 5, fixedFee: 25, withdrawFee: 1, status: 'Premium' }
  ]);

  editingContract = signal<FeeContract | null>(null);

  editContract(contract: FeeContract) {
    this.editingContract.set({ ...contract });
  }

  saveContract() {
    if (!this.editingContract()) return;
    
    this.contracts.update(list => 
      list.map(c => c.id === this.editingContract()?.id ? this.editingContract()! : c)
    );
    this.editingContract.set(null);
    // Appel API ici pour sauvegarder le contrat en base
  }
}