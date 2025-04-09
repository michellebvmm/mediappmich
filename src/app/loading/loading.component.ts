import { Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  template: `
    <div class="loading">
      <img src="path/to/loading.gif" alt="Cargando..." />
    </div>
  `,
  styles: [`
    .loading {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: rgba(255, 255, 255, 0.8);
    }
  `]
})
export class LoadingComponent {}