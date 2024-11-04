import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { NavigationEnd, NavigationExtras, Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { add, car, create, createOutline, personCircle } from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/UsuarioService/usuario.service';
import { VehiculoService } from 'src/app/services/VehiculoService/vehiculo.service';

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
  usuario: any = {};
  vehiculo:any = {};
  showAgregaVehiculo:boolean=true;

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private vehiculoService: VehiculoService
  ) {
    
    addIcons({
      'editar': createOutline,
      'person': personCircle,
      'car' : car,
      'add' :add
    });

    // Escuchar cuando se navega de nuevo a este componente
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url === '/tabs/perfil-usuario') {
        this.cargarDatos(); // Recargar los datos del usuario y el vehículo al navegar de nuevo a la página
      }
    });
  }

  async ngOnInit() {
    
    this.cargarDatos();
    
  }

  async cargarDatos() {
    // Obtener usuarios desde el servicio
    const usuarios = await this.usuarioService.obtenerUsuarios();
    const usuarioAutenticado = usuarios.find((usuario: any) => usuario.autenticado === true);
    

    const vehiculos = await this.vehiculoService.obtenerVehiculos();
    const vehiculoObj = vehiculos.find((vehiculo: any) => vehiculo.userPropietario === usuarioAutenticado?.correo);

    if (usuarioAutenticado) {

      // Asignar el atributo a la variable que mostraremos
      this.usuario = usuarioAutenticado;

      if(usuarioAutenticado.tieneAuto){
        this.showAgregaVehiculo = false;
      }else{
        this.showAgregaVehiculo = true;
      }

    }

    if(vehiculoObj){
      this.vehiculo = vehiculoObj;
    }

  }

  irEditarVehiculo(){
    let navigationExtras:NavigationExtras={
      state:{
        patente: this.vehiculo.patente
      }
    }
    this.router.navigate(['/tabs/editavehiculo'],navigationExtras );
  }

}
