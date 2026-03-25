import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-incident-list',
  imports: [ButtonModule],
  templateUrl: './incident-list.component.html',
  styleUrl: './incident-list.component.scss'
})
export class IncidentListComponent  implements OnInit {
  incidents: any[] = [
    { id: 101, title: 'Database Timeout', severity: 'High', status: 'New', date: '2024-03-25' },
    { id: 102, title: 'UI Alignment Issue', severity: 'Low', status: 'Resolved', date: '2024-03-24' }
  ];

  constructor() {}
  ngOnInit(): void {}
}