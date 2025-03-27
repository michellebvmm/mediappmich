import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'register', loadChildren: () => import('./register/register.module').then(m => m.RegisterPageModule) },
  { path: 'admin-users', loadChildren: () => import('./admin-users/admin-users.module').then(m => m.AdminUsersPageModule) },
  { path: 'view-profile', loadChildren: () => import('./view-profile/view-profile.module').then(m => m.ViewProfilePageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  // Ruta edit-user con un parámetro de ID dinámico
  { path: 'edit-user/:id', loadChildren: () => import('./edit-user/edit-user.module').then( m => m.EditUserPageModule) },
  {
    path: 'camara',
    loadChildren: () => import('./camara/camara.module').then( m => m.CamaraPageModule)
  },
  {
    path: 'doctor-detail',
    loadChildren: () => import('./doctor-detail/doctor-detail.module').then( m => m.DoctorDetailPageModule)
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
