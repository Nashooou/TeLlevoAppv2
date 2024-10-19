import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { home } from 'ionicons/icons';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class InicioPage implements OnInit {

  // Variables
  par_username: string = "Login";

  constructor(private router: Router) {
    console.log('PASO POR CONSTRUCTOR inicio')

    addIcons({
      'home':home
    });
  }

  ngOnInit() {
    
    console.log('Pasó por nginit inicio')
    // Obtener objeto de localStorage
    const usuariosObj = localStorage.getItem('usuarios'); // Cambiado a "usuarios"

    if (usuariosObj) {
      // Parsear de JSON a string
      const usuarios = JSON.parse(usuariosObj);
      
      // Aquí puedes obtener el nombre del último usuario que inició sesión
      // Si necesitas obtener un usuario específico, deberías pasar la lógica de identificación
      const usuarioAutenticado = usuarios.find((usuario: any) => usuario.ultimoUsuario === true);
      
      if (usuarioAutenticado) {
        // Asignar el atributo a la variable que mostraremos
        this.par_username = usuarioAutenticado.nombre;
      }
    }
  }
}