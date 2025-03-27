// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'; // Inicializa Firebase App en la nueva API
import { provideAuth, getAuth } from '@angular/fire/auth'; // Provee Auth con la nueva API
import { provideFirestore, getFirestore } from '@angular/fire/firestore'; // Provee Firestore con la nueva API
import { environment } from '../environments/environment'; // Configuración de Firebase

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)), // Inicializa Firebase con la configuración
    provideAuth(() => getAuth()), // Provee Auth con la nueva API
    provideFirestore(() => getFirestore()), // Provee Firestore con la nueva API
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}