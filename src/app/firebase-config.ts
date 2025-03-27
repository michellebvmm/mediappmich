// src/app/firebase-config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { environment } from '../environments/environment'; // Asegúrate de que la ruta sea correcta

// Inicializar Firebase
const app = initializeApp(environment.firebase);

// Inicializar servicios
const auth = getAuth(app);
const firestore = getFirestore(app);

export { app, auth, firestore };