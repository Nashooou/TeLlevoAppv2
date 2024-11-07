import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajeService, Viaje } from 'src/app/services/ViajeService/viaje.service';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, NavigationEnd, RouterLink} from '@angular/router';
import { UsuarioService } from 'src/app/services/UsuarioService/usuario.service';
import { ToastController } from '@ionic/angular/standalone';

// declarar una variable de google
declare var google: any;

@Component({
  selector: 'app-buscarviaje',
  templateUrl: './buscarviaje.page.html',
  styleUrls: ['./buscarviaje.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    RouterLink
  ]
})
export class BuscarviajePage implements OnInit {

  viajes: any[] = []; 
  nombreConductor: string='';
  usuarioAutenticado: any;
  viajeSolicitado: { [key: string]: boolean } = {};
  horaActualChile: string = '';
  tieneViajeSolicitado: boolean = false;


  constructor(
    private viajeService : ViajeService,
    private usuarioService:UsuarioService,
    private router : Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) { 
    
  }



  async ngOnInit() {
    this.cargarDatosViajes(); // Recarga los datos del mapa y los viajes
  }
  


  
  async cargarDatosViajes() {
    const usuarios = await this.usuarioService.obtenerUsuarios();
    this.usuarioAutenticado = usuarios.find(usuario => usuario.autenticado === true);

    if (!this.usuarioAutenticado) {
      console.log('No se pudo obtener el usuario autenticado');
      return;
    }

    const todosLosViajes = await this.viajeService.obtenerViajes();
    this.viajes = todosLosViajes.filter(viaje => viaje.userViaje !== this.usuarioAutenticado.correo);

    let viajeSolicitado = false;

    // Verificar si el usuario tiene algún viaje solicitado
    this.viajes.forEach(viaje => {
      const solicitado = viaje.solicitantes?.includes(this.usuarioAutenticado.correo) ?? false;
      this.viajeSolicitado[viaje.destino] = solicitado;

      if (solicitado) {
        viajeSolicitado = true;
      }
    });

    // Si hay un viaje solicitado, actualizamos la propiedad `tieneViajeSolicitado`
    this.tieneViajeSolicitado = viajeSolicitado;

    setTimeout(() => {
      this.viajes.forEach((viaje, index) => {
        const mapa = this.dibujarMapa(viaje, index);
        this.calcularRuta(viaje, mapa);
      });
    }, 0);
  }

  // Verificar si un viaje ha sido solicitado
  isViajeSolicitado(viaje: any): boolean {
    return this.viajeSolicitado[viaje.destino] || false;
  }



  // Método para verificar si el viaje se puede cancelar (menos de 30 minutos antes de la salida)
  puedeCancelar(viaje: any): boolean {
    const horaActual = new Date();
  
    // Hora de salida del viaje (convertirla a objeto Date)
    const [hora, minutos] = viaje.hora.split(':');
    
    // Crear una fecha con la hora actual, pero usando la hora del viaje
    const horaSalida = new Date(horaActual);
    horaSalida.setHours(Number(hora), Number(minutos), 0, 0); // Establecer la hora de salida en la fecha actual
    
    // Verificar si la hora de salida es en el día siguiente (si la hora está cerca de medianoche)
    if (horaActual.getHours() > 22 && Number(hora) < 6) {
      // Si la hora actual es después de las 22:00 y la hora de salida es en la madrugada,
      // entonces la hora de salida está en el día siguiente, así que ajustamos la fecha
      horaSalida.setDate(horaSalida.getDate() + 1); // Sumamos un día para ajustarla al día siguiente
    }
  
    // Calcular la diferencia en minutos
    const diferenciaMinutos = (horaSalida.getTime() - horaActual.getTime()) / (1000 * 60);
  
    // Si la diferencia es mayor a 30 minutos, se puede cancelar
    return diferenciaMinutos > 30;
  }


  async solicitarViaje(viaje: Viaje) {
    if (viaje.userViaje === this.usuarioAutenticado.correo) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No puedes solicitar tu propio viaje.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    if (viaje.solicitantes?.includes(this.usuarioAutenticado.correo)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ya solicitaste este viaje.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    if (viaje.asientosDisponibles <= 0) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ya no quedan asientos disponibles.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    viaje.asientosDisponibles--;
    viaje.solicitantes = viaje.solicitantes || [];
    viaje.solicitantes.push(this.usuarioAutenticado.correo);

    // Actualizar el estado del viaje solicitado
    this.viajeSolicitado[viaje.destino] = true;
    await this.viajeService.guardarListaViajes(this.viajes);

    const toast = await this.toastController.create({
      message: 'Solicitud realizada exitosamente',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    this.ngOnInit();
  }


  async cancelarSolicitud(viaje: Viaje) {
    
    if (!this.puedeCancelar(viaje)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No puedes cancelar el viaje cuando faltan menos de 30 minutos.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
  
    
    if (viaje.solicitantes?.includes(this.usuarioAutenticado.correo)) {
      viaje.solicitantes = viaje.solicitantes.filter(correo => correo !== this.usuarioAutenticado.correo);
      viaje.asientosDisponibles++;  // Liberar un asiento

      
      this.viajeSolicitado[viaje.destino] = false;
      await this.viajeService.guardarListaViajes(this.viajes);

      const toast = await this.toastController.create({
        message: 'Solicitud cancelada exitosamente',
        duration: 2000,
        color: 'danger',
        position: 'bottom'
      });
      await toast.present();
    }

    this.ngOnInit();
  }


 

  obtenerHoraActualChile(): string {
    const fechaChile = new Date();
    const options = {
      timeZone: 'America/Santiago',
      hour12: false,
      hour: '2-digit' as 'numeric',
      minute: '2-digit' as 'numeric',
      second: '2-digit' as 'numeric'
    };
    return fechaChile.toLocaleTimeString('en-US', options); // Devuelve la hora en formato 24 horas
  }





  convertirHoraViaje(viajeHora: string): Date {
    const [hora, minuto, segundo] = viajeHora.split(':');
    const ahora = new Date();
    const fechaViaje = new Date(ahora.setHours(Number(hora), Number(minuto), Number(segundo), 0));
    
    return fechaViaje;
  }



  dibujarMapa(viaje: any, index: number) {
    const mapElement = document.getElementById(`map${index}`);
    
    if (mapElement) {
      const { lat, lng } = viaje.destinoCoordenadas;

      if (lat && lng) {
        const mapa = new google.maps.Map(mapElement, {
          center: { lat, lng },
          zoom: 15,
        });

        
        new google.maps.Marker({
          position: { lat, lng },
          map: mapa,
        });

        
        this.calcularRuta(viaje, mapa);
      } else {
        console.error('Coordenadas inválidas para el viaje:', viaje);
      }
    } else {
      console.error('Elemento del mapa no encontrado para el índice:', index);
    }
  }





  calcularRuta(viaje: any, mapa: any) {
    const origen = viaje.origen; // Asegúrate de que 'origen' tenga las coordenadas
    const destino = viaje.destinoCoordenadas;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(mapa);

    const request = {
      origin: new google.maps.LatLng(origen.lat, origen.lng),
      destination: new google.maps.LatLng(destino.lat, destino.lng),
      travelMode: google.maps.TravelMode.DRIVING
    };

    directionsService.route(request, (result: any, status: any) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      } else {
        console.error('Error al calcular la ruta:', status);
      }
    });
  }

  

  actualizarHoraChile() {
    this.horaActualChile = this.obtenerHoraActualChile();
    console.log('Hora actual de Chile:', this.horaActualChile); 
  }

  irInicio() {
    this.router.navigate(['/tabs/inicio']);
  }
}