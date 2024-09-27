import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class PerfilUsuarioPage implements OnInit {
  usuario: any = {}; // Declara la variable usuario
  

  constructor() {}

  ngOnInit() {
    // Obtener los datos de todos los usuarios desde localStorage
    const usuariosData = localStorage.getItem('usuarios');
    
    if (usuariosData) {
      const usuarios = JSON.parse(usuariosData);
      
      // Buscar el usuario que ha iniciado sesión
      const ultimoUsuarioAutenticado = usuarios.find((usuario: any) => usuario.ultimoUsuario === true);

      if (ultimoUsuarioAutenticado) {
        this.usuario = ultimoUsuarioAutenticado; // Asignar el usuario encontrado
      }

    }
  }
}
