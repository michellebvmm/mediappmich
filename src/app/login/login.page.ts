import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; 
import { getAuth } from 'firebase/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore'; // Importar Firestore

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';
  isModalOpen = false;
  modalTitle = '';
  modalType = '';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private navCtrl: NavController,
    private firestore: Firestore // Inyectar Firestore
  ) {}

  async login() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert('Error: No se pudo obtener la información del usuario.');
        return;
      }

      // Obtener el rol desde Firestore
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const role = userData['role'] || 'desconocido'; 

        // Redirigir según el rol
        if (role === 'admin') { 
          this.router.navigate(['/admin-users']); 
        } else if (role === 'common_user') {
          this.router.navigate(['/home']); 
        } else {
        }
      } else {
        alert('No se encontró el usuario en la base de datos.');
      }
    } catch (error) {
      if (error instanceof Error) {
        alert('Error al iniciar sesión: ' + error.message);
      } else {
        alert('Error al iniciar sesión: ' + String(error));
      }
    }
  }

  navigateToRegister() {
    this.navCtrl.navigateForward('/register');
  }

  openModal(type: string) {
    this.modalType = type;
    if (type === 'terms') {
      this.modalTitle = 'Términos y Condiciones';
    } else if (type === 'privacy') {
      this.modalTitle = 'Política de Privacidad';
    }
    this.isModalOpen = true;
  }

  
  closeModal() {
    this.isModalOpen = false;
  }
}

