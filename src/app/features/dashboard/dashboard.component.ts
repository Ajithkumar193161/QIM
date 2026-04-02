import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { CardModule } from 'primeng/card';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule, CardModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private supabase: SupabaseClient;
  totalIncidents: number = 0;
  pendingRca: number = 0;
  resolutionRate: string = '0%';

  severityData: any;
  trendData: any;
  chartOptions: any;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async ngOnInit() {
    this.initChartOptions();
    await this.fetchDashboardData();
  }

  async fetchDashboardData() {
    // 1. Fetch data from Supabase 'incidents' table
    const { data: incidents, error } = await this.supabase
      .from('incidents')
      .select('*');

    if (error) {
      console.error('Error fetching dashboard data:', error);
      return;
    }

    if (incidents) {
      this.calculateStats(incidents);
      this.prepareSeverityChart(incidents);
      this.prepareTrendChart(incidents);
    }
  }

  calculateStats(incidents: any[]) {
    this.totalIncidents = incidents.length;
    this.pendingRca = incidents.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length;
    const resolved = incidents.filter(i => i.status === 'Resolved' || i.status === 'Closed').length;
    this.resolutionRate = this.totalIncidents > 0 
      ? Math.round((resolved / this.totalIncidents) * 100) + '%' 
      : '0%';
  }

  prepareSeverityChart(incidents: any[]) {
    const critical = incidents.filter(i => i.severity === 'Critical').length;
    const high = incidents.filter(i => i.severity === 'High').length;
    const medium = incidents.filter(i => i.severity === 'Medium').length;
    const low = incidents.filter(i => i.severity === 'Low').length;

    this.severityData = {
      labels: ['Critical', 'High', 'Medium', 'Low'],
      datasets: [{
        data: [critical, high, medium, low],
        backgroundColor: ['#ef4444', '#f97316', '#3b82f6', '#22c55e']
      }]
    };
  }
  prepareTrendChart(incidents: any[]) {
    // Logic to group by month (Simplified example)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const counts = months.map(m => {
        // This assumes your table has a 'created_at' date field
        return incidents.filter(i => new Date(i.created_at).toLocaleString('default', { month: 'short' }) === m).length;
    });
    this.trendData = {
      labels: months,
      datasets: [{
        label: 'Incidents Reported',
        data: counts,
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.4
      }]
    };
  }
  initChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true } }
      }
    };
  }
}