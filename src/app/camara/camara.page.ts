import { Component, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';


@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
})
export class CamaraPage {
  @ViewChild('imageCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  capturedImage: string | null = null;
  brightness = 1;
  contrast = 1;
  saturate = 1;
  opacity = 1;
  blur = 0;
  finalFilter = '';

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (!image.dataUrl) {
        console.error('Error: No se obtuvo una imagen.');
        return;
      }

      this.capturedImage = image.dataUrl;
      this.saveImage();
    } catch (error) {
      console.error('Error al tomar la foto:', error);
    }
  }

  saveImage() {
    if (!this.capturedImage) return;

    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = this.capturedImage;

    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx!.filter = this.finalFilter;
      ctx!.drawImage(img, 0, 0, img.width, img.height);

      const editedImageData = canvas.toDataURL('image/png');
      const response = await fetch(editedImageData);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, 'profile_picture.png');

      this.uploadImageToServer(formData);
    };
  }

  uploadImageToServer(formData: FormData) {
    const url = 'http://localhost:3000/upload';

    this.http.post(url, formData).subscribe(
      (response: any) => {
        const imagePath = response.imagePath; // "/uploads/1743783439251.png"
        const imageUrl = `http://localhost:3000${imagePath}`;
        this.saveProfilePicture(imageUrl);
      },
      (error) => {
        console.error('Error al subir la imagen:', error);
      }
    );
  }

  async saveProfilePicture(imageUrl: string) {
    const db = getFirestore();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const uid = userData?.uid;
  
    if (!uid) {
      console.error('UID no disponible en localStorage.');
      return;
    }
  
    const userRef = doc(db, 'users', uid);
  
    try {
      await updateDoc(userRef, { photo: imageUrl });
      console.log('✅ Foto de perfil guardada en Firestore:', imageUrl);
      
      // Mostrar el modal aquí
      this.showModal();
  
      // Esperar un momento antes de redirigir
      setTimeout(() => {
        this.router.navigate(['/perfil']);
      }, 2000); // Espera 2 segundos antes de redirigir
    } catch (error) {
      console.error('Error al guardar la foto en Firestore:', error);
    }
  }
  
  showModal() {
    // Lógica para abrir el modal
  }
  updateFilter() {
    this.finalFilter = `
      brightness(${this.brightness}) 
      contrast(${this.contrast}) 
      saturate(${this.saturate}) 
      opacity(${this.opacity}) 
      blur(${this.blur}px)
    `;
  }

  deleteImage() {
    this.capturedImage = null;
    this.brightness = 1;
    this.contrast = 1;
    this.saturate = 1;
    this.opacity = 1;
    this.blur = 0;
    this.updateFilter();
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
