import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div class="modal">
      <div class="modal-content">
        <span class="close" (click)="close()">&times;</span>
        <p>Foto de perfil actualizada</p>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      display: flex;
      justify-content: center;
      align-items: center;
      position: fixed;
      z-index: 1;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .modal-content {
      background-color: #fefefe;
      margin: 15% auto;
      padding: 20px;
      border: 1px solid #888;
      width: 80%;
    }
    .close {
      color: #aaa;
      float: right;
      font-size: 28px;
      font-weight: bold;
    }
    .close:hover,
    .close:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  `]
})
export class ModalComponent {
  close() {
    // Lógica para cerrar el modal
  }
}