import { Component, ViewChild, ElementRef } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-camara',
  templateUrl: './camara.page.html',
  styleUrls: ['./camara.page.scss'],
  standalone: false,
})
export class CamaraPage {
  @ViewChild('imageCanvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  
  capturedImage: string | null = null;
  brightness: number = 1;
  contrast: number = 1;
  saturate: number = 1;
  opacity: number = 1;
  blur: number = 0;
  finalFilter: string = '';

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.capturedImage = image.dataUrl!;
    this.updateFilter();
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

  saveImage() {
    if (!this.capturedImage) return;

    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const img = new Image();
    img.src = this.capturedImage;
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.filter = this.finalFilter;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const dataUrl = canvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'foto_editada.png';
      link.click();
    };
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
}