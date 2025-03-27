import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
})
export class AdminUsersPage implements OnInit {
  users: any[] = [];
  isModalOpen = false;
  newUser = { name: '', email: '', permissions: '' };

  constructor(
    private userService: UserService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      this.users = await this.userService.getUsers();
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  }

  openCreateUserModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  async createUser() {
    try {
      await this.userService.createUser(this.newUser);
      this.loadUsers();
      this.closeModal();
    } catch (error) {
      console.error('Error creando usuario:', error);
    }
  }

  async editUser(userId: string) {
    console.log('Editar usuario:', userId);
  }

  async deleteUser(userId: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de que quieres eliminar este usuario?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.userService.deleteUser(userId);
              this.loadUsers();
            } catch (error) {
              console.error('Error eliminando usuario:', error);
            }
          },
        },
      ],
    });
    await alert.present();
  }
}

