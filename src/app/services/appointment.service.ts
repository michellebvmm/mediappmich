import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  constructor(private firestore: AngularFirestore) {}

  async createAppointment(appointment: any) {
    await this.firestore.collection('appointments').add(appointment);
  }
}
