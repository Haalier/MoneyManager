import { Component, computed, effect, input } from '@angular/core';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-financial-pie-chart',
  standalone: true,
  imports: [ChartModule],
  templateUrl: './financial-pie-chart.html',
  styleUrls: ['./financial-pie-chart.css'],
})
export class FinancialPieChartComponent {
  data = input.required<any[]>();
  colors = input<string[]>([]);
  label = input<string>('');
  totalAmount = input<string | number>(0);
  showTextAnchor = input<boolean>(true);
  documentStyle = getComputedStyle(document.documentElement);
  textColor = this.documentStyle.getPropertyValue('--p-text-color');

  chartData = computed(() => ({
    labels: this.data().map((d) => d.name),
    datasets: [
      {
        data: this.data().map((d) => d.amount()),
        backgroundColor: this.colors(),
        hoverBackgroundColor: this.colors(),
        borderWidth: 0,
        cutout: '80%',
      },
    ],
  }));

  chartOptions = computed(() => ({
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 12,
          boxHeight: 12,
          padding: 20,
        },
      },
      tooltip: { enabled: true },
    },
  }));
}
