// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): Observable<boolean> {
    const auth = getAuth(); // Obtener la instancia de Auth

    return new Observable<boolean>(observer => {
      onAuthStateChanged(auth, user => {
        if (user) {
          observer.next(true);
        } else {
          this.router.navigate(['/login']);
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}