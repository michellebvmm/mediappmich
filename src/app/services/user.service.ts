import { Injectable } from '@angular/core';
import { firestore } from '../firebase-config';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { AuthService } from './auth.service';
import { addDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCollection = collection(firestore, 'users');

  constructor(private authService: AuthService) {}

  // Obtener todos los usuarios (solo si el usuario tiene permisos)
  async getUsers() {
    const user = this.authService.getUser();
  
    if (!user || !user.permissions.includes('get_user')) {
      throw new Error('No tienes permisos para ver usuarios');
    }
  
    const snapshot = await getDocs(this.usersCollection);
    return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));  // Cambié 'id' por 'uid'
  }

  // Obtener un usuario por ID
  async getUserById(userId: string) {
    const userDocRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }

    return { id: userDoc.id, ...userDoc.data() };
  }

  async updateUser(userId: string, data: any) {
    const user = this.authService.getUser();

    if (!user || !user.permissions.includes('update_user')) {
      throw new Error('No tienes permisos para actualizar usuarios');
    }

    const userDocRef = doc(firestore, 'users', userId);
    await updateDoc(userDocRef, data);
  }

  async deleteUser(userId: string) {
    const user = this.authService.getUser();
  
    if (!user || !user.permissions.includes('delete_user')) {
      throw new Error('No tienes permisos para eliminar usuarios');
    }
  
    const userDocRef = doc(firestore, 'users', userId);
  
    // Marca al usuario como eliminado, por ejemplo con un campo "deleted"
    await updateDoc(userDocRef, { deleted: true });
  }

  async createUser(data: any) {
    const user = this.authService.getUser();
  
    if (!user || !user.permissions.includes('create_user')) {
      throw new Error('No tienes permisos para crear usuarios');
    }
  
    // Añadir un nuevo documento a la colección "users"
    await addDoc(this.usersCollection, data);
  }
}
