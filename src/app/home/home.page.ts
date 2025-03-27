import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, collectionData, getDocs, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  doctors: any[] = [];
  users: any[] = [];
  canUpdate: boolean = false;

  constructor(private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    this.loadDoctors();
  }
  
  async loadDoctors() {
    const doctorsRef = collection(this.firestore, 'doctors'); 
    const q = query(doctorsRef, where('active', '==', true));
  
    try {
      const querySnapshot = await getDocs(q);
      this.doctors = []; 
      querySnapshot.forEach((doc) => {
        const doctorData = doc.data();
        this.doctors.push({ id: doc.id, ...doctorData });
      });
      console.log("Doctores cargados:", this.doctors); 
    } catch (error) {
      console.error("Error obteniendo doctores:", error);
    }
  }
  verDoctor(doctorId: string) {
    this.router.navigate(['/doctor-detail', doctorId]);
  }
  editUser(uid: string) {
    console.log('Editar usuario con UID:', uid);
  }  

  logout() {
    console.log("Cerrar sesión");
  }
}
