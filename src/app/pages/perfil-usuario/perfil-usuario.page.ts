import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, car, create, createOutline, personCircle } from 'ionicons/icons';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.page.html',
  styleUrls: ['./perfil-usuario.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    RouterLink
  ]
})
export class PerfilUsuarioPage implements OnInit {
  usuario: any = {}; // Declara la variable usuario
  

  constructor(
    private router: Router
  ) {
    
    addIcons({
      'editar': createOutline,
      'person': personCircle,
      'car' : car,
      'add' :add
    });
  }

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
