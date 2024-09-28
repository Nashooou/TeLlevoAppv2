import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full',},
  { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio.page').then( m => m.InicioPage) },
  { path: 'login', loadComponent: () => import('./login/login.page').then( m => m.LoginPage)},
  { path: 'registro-usuario', loadComponent: () => import('./registro-usuario/registro-usuario.page').then( m => m.RegistroUsuarioPage)},
  { path: 'recuperar-contrasena', loadComponent: () => import('./recuperar-contrasena/recuperar-contrasena.page').then( m => m.RecuperarContrasenaPage)},
  { path: 'perfil-usuario', loadComponent: () => import('./pages/perfil-usuario/perfil-usuario.page').then( m => m.PerfilUsuarioPage)},
  { path: 'editaperfil', loadComponent: () => import('./pages/crud/editaperfil/editaperfil.page').then( m => m.EditaperfilPage)},


];
