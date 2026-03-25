import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  severityData: any;
  trendData: any;
  chartOptions: any;

  ngOnInit() {
    this.initCharts();
  }

  initCharts() {
    // 1. Severity Distribution (Pie Chart)
    this.severityData = {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        data: [5, 12, 20, 15],
        backgroundColor: ['#ef4444', '#f97316', '#3b82f6', '#22c55e']
      }]
    };

    // 2. Incident Trends (Line Chart)
    this.trendData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Incidents Reported',
        data: [10, 25, 15, 30, 22],
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.4
      }]
    };

  this.chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill the parent container
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 10
        }
      }
    },
    // For the Line Chart specifically, you can add scales
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: '#ebedef'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };
  }
}