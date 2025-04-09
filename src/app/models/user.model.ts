// src/app/models/user.model.ts
import { CollectionReference, DocumentData, DocumentReference } from 'firebase/firestore'; 
import { FieldValue } from 'firebase/firestore'; 

// src/app/models/user.model.ts
export interface User {
    uid: string; // Cambiado a propiedad
    email: string;
    username: string;
    password?: string; 
    rol: DocumentReference; 
    tipo_usuario: String;
    last_login: FieldValue; 
    photo?: string; // <-- Hacerlo opcional
}