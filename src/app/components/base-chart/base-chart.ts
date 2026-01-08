import { Component, ElementRef, ViewChild, effect, input, AfterViewInit, OnDestroy, signal } from '@angular/core';
import { Chart, registerables, ChartType, ChartData, ChartOptions } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-base-chart',
  standalone: true,
  template: `
    <div class="relative w-full h-[300px]">
      <canvas #chartCanvas></canvas>
    </div>
  `
})
export class BaseChart implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  type = input.required<ChartType>();
  data = input.required<ChartData>();
  options = input<ChartOptions>();

  private chart: Chart | null = null;
  private isDomReady = signal(false);
  
  // On mémorise le dernier type utilisé pour la comparaison
  private currentType: ChartType | null = null;

  constructor() {
    effect(() => {
      const type = this.type();
      const data = this.data();
      const ready = this.isDomReady();

      if (ready && this.canvasRef) {
        this.renderOrUpdate(type, data);
      }
    });
  }

  ngAfterViewInit() {
    // Utilisation de requestAnimationFrame pour s'assurer que le rendu navigateur est fait
    requestAnimationFrame(() => {
      this.isDomReady.set(true);
    });
  }

  private renderOrUpdate(type: ChartType, data: ChartData) {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;

    // Si le graphique existe DÉJÀ
    if (this.chart) {
      // Si le TYPE a changé (ex: passage de 'bar' à 'line')
      // On compare avec notre variable locale currentType au lieu de fouiller dans this.chart.config
      if (this.currentType !== type) {
        this.chart.destroy();
        this.createNewChart(ctx, type, data);
      } else {
        // Simple mise à jour des données (même type)
        this.chart.data = data;
        this.chart.options = this.getOptions();
        this.chart.update();
      }
    } else {
      // Création initiale
      this.createNewChart(ctx, type, data);
    }
  }

  private createNewChart(ctx: CanvasRenderingContext2D, type: ChartType, data: ChartData) {
    this.currentType = type; // On stocke le type actuel
    this.chart = new Chart(ctx, {
      type: type,
      data: data,
      options: this.getOptions()
    });
  }

  private getOptions(): ChartOptions {
    return this.options() || {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    };
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}