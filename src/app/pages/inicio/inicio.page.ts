import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { home } from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/UsuarioService/usuario.service';

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

  constructor(
    private router: Router,
    private usuarioService: UsuarioService
  ) {
    

    addIcons({
      'home':home
    });

  }

  async ngOnInit() {
    // Obtener usuarios desde el servicio
    const usuarios = await this.usuarioService.obtenerUsuarios();
    
    // Aquí puedes obtener el nombre del último usuario que inició sesión
    const usuarioAutenticado = usuarios.find((usuario: any) => usuario.autenticado === true);
    
    if (usuarioAutenticado) {
      // Asignar el atributo a la variable que mostraremos
      this.par_username = usuarioAutenticado.nombre;
    }
  }
}