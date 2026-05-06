import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-report-incident',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, CardModule, InputTextModule, 
     DropdownModule, ButtonModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './report-incident.component.html'
})
export class ReportIncidentComponent {
  private supabase: SupabaseClient;
  incidentForm: FormGroup;
  loading: boolean = false;

  severityOptions = [
    { label: 'Critical', value: 'Critical' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' }
  ];

  moduleOptions = [
    { label: 'Frontend', value: 'Frontend' },
    { label: 'Backend', value: 'Backend' },
    { label: 'Database', value: 'Database' },
    { label: 'Auth', value: 'Auth' }
  ];

  constructor(private fb: FormBuilder, private messageService: MessageService) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    
    this.incidentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      module: ['', Validators.required],
      severity: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.incidentForm.valid) {
      this.loading = true;
      const userData = localStorage.getItem("currentUser");
      const user = userData ? JSON.parse(userData) : null;
      if (!user || !user.id) {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'Session Expired', 
          detail: 'Please login again to report an incident' 
        });
        this.loading = false;
        return;
      }  
      const formData = this.incidentForm.value;

      const { error } = await this.supabase
        .from('incidents')
        .insert([{
          title: formData.title,
          module: formData.module,
          severity: formData.severity,
          description: formData.description,
          status: 'New',
          created_by: user.id
        }]);
      this.loading = false;  
      if (error) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save incident: ' + error.message});
      } else {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Incident reported successfully' });
        this.incidentForm.reset();
      }
    }
  }
}