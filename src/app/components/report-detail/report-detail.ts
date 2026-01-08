import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-report-detail',
  imports: [],
  templateUrl: './report-detail.html',
  styleUrl: './report-detail.css',
})
export class ReportDetail {
  report = input.required<any>();
  onBack = output<void>();
}
