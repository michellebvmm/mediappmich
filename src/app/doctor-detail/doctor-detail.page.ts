import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, collection, addDoc, Timestamp } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction'; // ⬅️ Necesario para dateClick
import dayGridPlugin from '@fullcalendar/daygrid';
import { AlertController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-doctor-detail',
  templateUrl: './doctor-detail.page.html',
  styleUrls: ['./doctor-detail.page.scss'],
})
export class DoctorDetailPage implements OnInit {
  doctor: any = null;
  doctorId: string | undefined;
  patientId: string | undefined;  // ID del paciente
  selectedDate: Date | null = null;
  safeMapUrl!: SafeResourceUrl;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    dateClick: this.handleDateClick.bind(this)
  };

  constructor(
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router,
    private authService: AuthService,
    private alertController: AlertController,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.doctorId = this.route.snapshot.paramMap.get('id') ?? '';
    this.patientId = this.authService.getUserId() ?? undefined;
    const location = this.doctor?.clinic_location || 'Querétaro';
    const lat = 20.617338277253808;
    const lng = -100.40749985193818;
    const baseUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(baseUrl);
    if (this.doctorId) {
      await this.loadDoctor();
    }
  }

  async loadDoctor() {
    if (this.doctorId) {
      try {
        const doctorRef = doc(this.firestore, 'doctors', this.doctorId);
        const doctorSnap = await getDoc(doctorRef);

        if (doctorSnap.exists()) {
          this.doctor = doctorSnap.data();
          console.log('Doctor cargado:', this.doctor);
        } else {
          console.warn('No se encontró el doctor con ese ID');
        }
      } catch (error) {
        console.error('Error al cargar el doctor:', error);
      }
    }
  }



  handleDateClick(arg: any) {
    this.selectedDate = new Date(arg.dateStr);
    console.log('Fecha seleccionada:', this.selectedDate);
    alert('Seleccionaste: ' + this.selectedDate.toDateString());
  }

  async mostrarAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Cita Agendada',
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }
  
  goBack(){
    this.router.navigate(['/home']);
  }

  async agendarCita() {
    if (this.doctorId && this.patientId && this.selectedDate) {
      try {
        const appointmentsRef = collection(this.firestore, 'appointments');
        const newAppointment = {
          doctorId: this.doctorId,
          patientId: this.patientId,
          appointmentDate: Timestamp.fromDate(this.selectedDate),
          status: 'pendiente',
        };
  
        await addDoc(appointmentsRef, newAppointment);
        console.log(`Cita agendada con el doctor ${this.doctor.name} en ${this.selectedDate}`);
        await this.mostrarAlerta('¡Tu cita ha sido agendada con éxito!');
      } catch (error) {
        console.error('Error al agendar la cita:', error);
      }
    } else {
      alert('Primero selecciona una fecha en el calendario.');
    }
  }
  navigateToProfile() {
    this.router.navigate(['/perfil']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout(); // Asegúrate de que tu servicio de autenticación tenga este método
    this.router.navigate(['/login']); // Redirige a la página de inicio de sesión
  }
}