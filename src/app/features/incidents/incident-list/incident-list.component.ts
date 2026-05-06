import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';

type TagSeverity = "success" | "info" | "warn" | "danger" | "secondary" | "contrast" | undefined;

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule, TableModule, TagModule, ButtonModule, 
    InputTextModule, IconFieldModule, InputIconModule
  ],
  templateUrl: './incident-list.component.html'
})
export class IncidentListComponent implements OnInit {
  private supabase: SupabaseClient;
  incidents: any[] = [];
  loading: boolean = true;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  ngOnInit() {
    this.getIncidents();
  }

  async getIncidents() {
    this.loading = true;
    
    // Fetching data from your new Supabase 'incidents' table
    const { data, error } = await this.supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching incidents:', error);
    } else {
      this.incidents = data;
    }
    this.loading = false;
  }

  // Helper for Severity Colors
  getSeverity(severity: string): TagSeverity {
    switch (severity) {
      case 'Critical': return 'danger';
      case 'High':     return 'warn';
      case 'Medium':   return 'info';
      case 'Low':      return 'success';
      default:         return 'secondary';
    }
  }

  // Helper for Status Colors
  getStatusSeverity(status: string): TagSeverity {
    switch (status) {
      case 'New':         return 'info';
      case 'In-Progress': return 'warn';
      case 'Resolved':    return 'success';
      case 'Closed':      return 'secondary';
      default:            return 'contrast';
    }
  }
}