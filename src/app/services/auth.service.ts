import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth, firestore } from '../firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, DocumentSnapshot, DocumentData } from 'firebase/firestore';
import * as bcrypt from 'bcryptjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  [x: string]: any;
  private userData: any = null;
  userId: string | null = null;
  constructor(private router: Router) {}

  async register(email: string, username: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      const user: User = {
        uid,
        email,
        username,
        password: await bcrypt.hash(password, 10),
        rol: doc(firestore, 'rol', 'common_user'),
        tipo_usuario: 'paciente',
        last_login: serverTimestamp(),
        photo: 'assets/default-avatar.png' // <- Valor por defecto
      };
  
      await setDoc(doc(firestore, 'users', uid), user);
    } catch (error) {
      console.error('Error al registrar:', error);
      throw error;
    }
  }
  

  async registerDoctor(email: string, username: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
  
      const user: User = {
        uid,
        email,
        username,
        password: await bcrypt.hash(password, 10),
        rol: doc(firestore, 'rol', 'doctor'), 
        tipo_usuario: 'doctor',
        last_login: serverTimestamp()
      };
  
      await setDoc(doc(firestore, 'users', uid), user);
    } catch (error) {
      console.error('Error al registrar doctor:', error);
      throw error;
    }
  }
  
  
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log('UID del usuario:', uid);
  
      const userDoc = await getDoc(doc(firestore, 'users', uid));
      if (!userDoc.exists()) {
        throw new Error('Usuario no encontrado');
      }
  
      const userData = userDoc.data();
      const storedPassword = userData['password'] || '';
  
      const passwordMatch = await bcrypt.compare(password, storedPassword);
      if (!passwordMatch) {
        throw new Error('Contraseña incorrecta');
      }
  
      // Obtener rol y permisos con tipado explícito
      const rolRef = userData['rol'];
      const roleDoc = await getDoc(rolRef) as DocumentSnapshot<DocumentData>;
  
      if (!roleDoc.exists()) {
        throw new Error('Documento de rol no encontrado');
      }
  
      const roleData = roleDoc.data() as { permissions?: string[] };
      const permissions = roleData?.permissions || [];
  
      const roleName = rolRef.id.trim();
      console.log('Rol:', roleName, 'Permisos:', permissions);
  
      // 🔥 Guardar UID en el servicio
      this.userId = uid;
  
      // Guardar en localStorage para futuras validaciones
      this.userData = { uid, email, role: roleName, permissions };
      localStorage.setItem('userData', JSON.stringify(this.userData));
  
      // Redirección basada en el rol
      if (roleName === 'common_user') {
        this.router.navigate(['/home']);
      } else if (roleName === 'admin') {
        this.router.navigate(['/admin-users']);
      } else {
        this.router.navigate(['/home']);
      }
  
      return { email, role: roleName, permissions };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }
  

  async logout() {
    await signOut(auth);
    localStorage.removeItem('userData');
    this.router.navigate(['/login']);
  }

  getUser() {
    return JSON.parse(localStorage.getItem('userData') || '{}');
  }
  
  getUserId(): string | null {
    const user = this.getUser();  // Usamos getUser() que ya devuelve los datos del usuario desde localStorage
    return user?.uid || null;  // Retorna el uid del usuario, o null si no está presente
  }
  
  hasPermission(permission: string): boolean {
    const user = this.getUser();
    return user.permissions ? user.permissions.includes(permission) : false;
  }
}
