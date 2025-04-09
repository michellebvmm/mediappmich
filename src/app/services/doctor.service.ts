import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  constructor(private firestore: AngularFirestore) {}

  getDoctorById(id: string) {
    return this.firestore.collection('doctors').doc(id).valueChanges().toPromise();
  }

  async updateDoctorRating(id: string, rating: number) {
    await this.firestore.collection('doctors').doc(id).update({ rating });
  }
}
