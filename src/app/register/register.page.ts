// src/app/register/register.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  username: string = '';
  role: string = ''; 

  constructor(private authService: AuthService, private router: Router) {}

  async register() {
    try {
      await this.authService.register(this.email, this.username, this.password);
      alert('Usuario registrado con éxito');
      this.router.navigate(['/login']);
    } catch (error) {
      if (error instanceof Error) {
        alert('Error al registrarse: ' + error.message);
      } else {
        alert('Error al registrarse: ' + String(error));
      }
    }
  }

  async registerDoctor() {
    try {
      await this.authService.register(this.email, this.username, this.password);
      alert('Usuario registrado con éxito');
      this.router.navigate(['/login']);
    } catch (error) {
      if (error instanceof Error) {
        alert('Error al registrarse: ' + error.message);
      } else {
        alert('Error al registrarse: ' + String(error));
      }
    }
  }
}