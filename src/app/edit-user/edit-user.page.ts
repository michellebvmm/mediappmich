import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.page.html',
  styleUrls: ['./edit-user.page.scss'],
})
export class EditUserPage implements OnInit {
  userId: string = '';
  user: any = {};

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    if (this.userId) {
      this.user = await this.userService.getUserById(this.userId);
    }
  }

  async saveUser() {
    try {
      await this.userService.updateUser(this.userId, this.user);
      console.log('Usuario actualizado correctamente');
      this.router.navigate(['/home']);
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
    }
  }
  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
  goBack() {
    this.router.navigate(['home']); 
  }
}
