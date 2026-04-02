import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-rca',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CardModule, 
    DropdownModule, ButtonModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './rca.component.html'
})
export class RcaComponent implements OnInit {
  private supabase: SupabaseClient;
  rcaForm: FormGroup;
  openIncidents: any[] = [];
  loading: boolean = false;

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    this.rcaForm = this.fb.group({
      incidentId: [null, Validators.required],
      rootCause: ['', [Validators.required, Validators.minLength(10)]],
      correctiveAction: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.loadOpenIncidents();
  }

  async loadOpenIncidents() {
    // Only fetch incidents that are NOT resolved or closed
    const { data, error } = await this.supabase
      .from('incidents')
      .select('id, title')
      .in('status', ['New', 'In-Progress']);

    if (!error) {
      this.openIncidents = data.map((i: { id: any; title: any; }) => ({ label: `#${i.id} - ${i.title}`, value: i.id }));
    }
  }

  async onSaveRca() {
    if (this.rcaForm.valid) {
      this.loading = true;
      const val = this.rcaForm.value;

      const { error } = await this.supabase
        .from('incidents')
        .update({
          root_cause: val.rootCause,
          corrective_action: val.correctiveAction,
          status: 'Resolved',
          resolved_at: new Date().toISOString()
        })
        .eq('id', val.incidentId);

      this.loading = false;

      if (error) {
        this.messageService.add({ severity: 'error', summary: 'Failure', detail: 'Update failed' });
      } else {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'RCA Completed & Incident Resolved' });
        this.rcaForm.reset();
        this.loadOpenIncidents(); // Refresh the list
      }
    }
  }
}