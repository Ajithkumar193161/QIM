import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // <-- For router-outlet
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar'; 
import { AvatarModule } from 'primeng/avatar';
@Component({
  selector: 'app-app-layout',
  imports: [
    CommonModule, 
    RouterModule,    
    SidebarComponent,
    ButtonModule,
    SidebarModule, 
    AvatarModule
  ],
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent implements OnInit {
  isSidebarVisible = true;
  currentUser: any = { full_name: '', role: '' }; // Placeholder object
  userProfileVisible = false;
  constructor(private router: Router) {}

  ngOnInit() {
    // Get the string from localStorage
    const userData = localStorage.getItem("currentUser");
    
    if (userData) {
      // Convert the string back into a JavaScript Object
      this.currentUser = JSON.parse(userData);
    } else {
      // Security: If no user data exists, force them to login
      this.router.navigate(['/login']);
    }
  }

logout() {
    // Clear session and go back to login
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }
}
