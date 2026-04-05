import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // <-- For router-outlet
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
@Component({
  selector: 'app-app-layout',
  imports: [
    CommonModule, 
    RouterModule,    
    SidebarComponent,
    ButtonModule
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {
  isSidebarVisible = true;
  constructor(private router: Router) {}
logout() {
    // Clear session and go back to login
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
