import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-doctor-detail',
  templateUrl: './doctor-detail.page.html',
  styleUrls: ['./doctor-detail.page.scss'],
})
export class DoctorDetailPage implements OnInit {
  doctor: any = null;
  doctorId: string | undefined;
  

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  async ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.doctorId) {
      await this.loadDoctor();
    }
  }

  async loadDoctor() {
    if (this.doctorId) {
      const doctorRef = doc(this.firestore, 'doctors', this.doctorId);
    } else {
      console.error('No se encontró un ID de doctor válido');
    }
    
  }

  agendarCita() {
    console.log(`Agendar cita con el doctor ${this.doctor.name}`);
    // Aquí puedes navegar a una nueva página de agendamiento de citas
  }
}
