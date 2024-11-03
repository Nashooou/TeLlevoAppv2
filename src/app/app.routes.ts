import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
  { path: 'registro-usuario', loadComponent: () => import('./registro-usuario/registro-usuario.page').then(m => m.RegistroUsuarioPage) },
  { path: 'recuperar-contrasena', loadComponent: () => import('./recuperar-contrasena/recuperar-contrasena.page').then(m => m.RecuperarContrasenaPage) },

  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage) },
      { path: 'perfil-usuario', loadComponent: () => import('./pages/perfil-usuario/perfil-usuario.page').then(m => m.PerfilUsuarioPage) },
      { path: 'editaperfil', loadComponent: () => import('./pages/crud/editaperfil/editaperfil.page').then(m => m.EditaperfilPage) },
      { path: 'programar-viaje', loadComponent: () => import('./pages/programar-viaje/programar-viaje.page').then(m => m.ProgramarViajePage) },
      { path: 'registravehiculo', loadComponent: () => import('./pages/crud/registravehiculo/registravehiculo.page').then(m => m.RegistravehiculoPage) },
      { path: 'editavehiculo', loadComponent: () => import('./pages/crud/editavehiculo/editavehiculo/editavehiculo.page').then( m => m.EditavehiculoPage) },
      { path: 'buscarviaje', loadComponent: () => import('./pages/buscar-viaje/buscarviaje/buscarviaje.page').then( m => m.BuscarviajePage)},
      { path: '', redirectTo: 'inicio', pathMatch: 'full' } // Redirige a la página "inicio" por defecto
    ]
  },
  

  


];
