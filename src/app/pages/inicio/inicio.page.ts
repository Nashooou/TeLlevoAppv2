import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class InicioPage implements OnInit {

  // Variables
  par_username: string = "Login";

  constructor(private router: Router) {}

  ngOnInit() {
    // Obtener objeto de localStorage
    const usuariosObj = localStorage.getItem("usuarios"); // Cambiado a "usuarios"

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