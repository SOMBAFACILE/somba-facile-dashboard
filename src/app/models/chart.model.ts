import { ChartType, ChartData, ChartOptions } from 'chart.js';

export interface AppChartConfig {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
}