import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { addIcons } from 'ionicons';
import { home } from 'ionicons/icons';
import { UsuarioService } from 'src/app/services/UsuarioService/usuario.service';
import { ViajeService } from 'src/app/services/ViajeService/viaje.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterLink]
})
export class InicioPage implements OnInit {

  // Variables
  par_nombre: string = "Login";
  showBtnProgramar:boolean=false;
  showAvisoVehiculo:boolean=true;
  showBtnVerViaje:boolean=false;
  viajes: any[] = [];
  horaActualChile: string = '';
  private intervalo: any;
  isAdmin: boolean=false;
  fechaActualChile: string = '';

  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private viajeService: ViajeService
  ) {
    

    addIcons({
      'home':home
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url === '/tabs/inicio') {
        this.ngOnInit(); // Recargar los datos del usuario y el vehículo al navegar de nuevo a la página
      }
    });

  }

  
  async ngOnInit() {
    
    this.actualizarHoraChile();
    this.intervalo = setInterval(() => this.actualizarHoraChile(), 1000);
    this.fechaActualChile = this.obtenerFechaActualChile();
    

    // Obtener usuarios desde el servicio
    const usuarios = await this.usuarioService.obtenerUsuarios();
    
    // Aquí puedes obtener el nombre del último usuario que inició sesión
    const usuarioAutenticado = usuarios.find((usuario: any) => usuario.autenticado === true);
    
    //Si no se obtiene el usuario autenticado es por que es admin
    if (!usuarioAutenticado) {
      this.par_nombre = 'Admin'
      this.isAdmin = true;
      
      return;
    }
    // Asignar el atributo a la variable que mostraremos
    this.par_nombre = usuarioAutenticado.nombre;
    
    this.viajes = await this.viajeService.obtenerViajes() || [];

    const viajeUsuario = this.viajes.find((viaje: any) => viaje.userViaje === usuarioAutenticado.correo);

    
    //Si el usuario no tiene un vehiculo registrado se muestra aviso de registro de vehiculo
    if(!usuarioAutenticado.tieneAuto && !viajeUsuario){
      this.showAvisoVehiculo = true;
      this.showBtnVerViaje = false;
      this.showBtnProgramar = false;
      return;
    }

    //Si el usuario tiene un vehiculo pero no tiene un viaje programado aún, se muestra el botón para programar viaje
    if(usuarioAutenticado.tieneAuto && !viajeUsuario){
      this.showAvisoVehiculo = false;
      this.showBtnVerViaje = false;
      this.showBtnProgramar = true;
      return;
    }
    
    if(usuarioAutenticado.tieneAuto && viajeUsuario){
      this.showAvisoVehiculo = false;
      this.showBtnVerViaje = true;
      this.showBtnProgramar = false;
    }

  }

  ngOnDestroy() {
    if (this.intervalo) {
      clearInterval(this.intervalo); // Limpiar intervalo cuando se destruye el componente
    }
  }

  obtenerHoraActualChile(): string {
    const fechaChile = new Date(); // Obtenemos la hora local
    // Establecemos la zona horaria de Chile y la convertimos a formato HH:mm:ss
    const options = { 
      timeZone: 'America/Santiago', 
      hour12: false, 
      hour: '2-digit' as 'numeric',  // Asegúrate de usar '2-digit' o 'numeric'
      minute: '2-digit' as 'numeric', 
      second: '2-digit' as 'numeric' 
    };
    return fechaChile.toLocaleTimeString('en-US', options); // La hora se muestra en formato 24 horas
  }

  obtenerFechaActualChile(): string {
    const fechaChile = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: '2-digit' 
    };
  
    try {
      return fechaChile.toLocaleDateString('es-CL', options); // Asegúrate de usar el idioma correcto
    } catch (error) {
      console.error('Error al formatear la fecha:', error);
      return ''; // En caso de error, devolver una cadena vacía
    }
  }

  actualizarHoraChile() {
    this.horaActualChile = this.obtenerHoraActualChile();
  }
  


  irBuscarViaje() {
    window.location.href = '/tabs/buscarviaje';
  }
  
  irViajeProgramado() {
    window.location.href = '/tabs/ver-viaje-detalle';
  }
  

}