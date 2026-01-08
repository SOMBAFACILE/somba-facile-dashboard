import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dispute-detail',
  imports: [],
  templateUrl: './dispute-detail.html',
  styleUrl: './dispute-detail.css',
})
export class DisputeDetail {
  dispute = input.required<any>();
  onBack = output<void>();

}
