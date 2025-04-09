import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { user } from 'rxfire/auth';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  userId: string = ''; // ID del usuario
  users: any = {}; // Datos del usuario

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    // Obtener el usuario actual
    const currentUser  = this.authService.getUser ();
    this.userId = currentUser .uid; // Asegúrate de que el uid esté presente
    console.log(currentUser);
    console.log(this.userId);
    if (this.userId) {
      try {
        // Obtener los datos del usuario usando el método correcto
        this.users = await this.userService.getUserById(this.userId); // Asegúrate de que el nombre del método sea correcto
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
      }
    } else {
      console.error('No se encontró el ID del usuario.');
    }
  }

  async saveUser () {
    try {
      // Actualizar el usuario con los datos del formulario
      await this.userService.updateUser (this.userId, {
        username: this.users.username,
        email: this.users.email,
      });
      console.log('Usuario actualizado correctamente');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  }

  goToCamera() {
    this.router.navigate(['/camara']);
  }

  async logout() {
    await this.authService.logout();
  }
  navigateToProfile() {
    this.router.navigate(['/perfil']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }
}