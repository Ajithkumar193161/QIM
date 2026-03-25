import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
 imports: [CommonModule,CardModule, CardModule, ButtonModule, InputTextModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  
constructor(private router: Router) {}

  onLogin() {
    // For now, let's just bypass and go to dashboard
    // Later, you can add real API authentication here
    localStorage.setItem('isLoggedIn', 'true');
    this.router.navigate(['/dashboard']);
  }
}