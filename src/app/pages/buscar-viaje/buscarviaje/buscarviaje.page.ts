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

  viajes: any[] = []; // Aquí almacenaremos la información de los viajes
  nombreConductor: string='';

  constructor(
    private viajeService : ViajeService,
    private usuarioService:UsuarioService,
    private router : Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) { 
    
  }

  ionViewWillEnter() {
    this.ngOnInit(); // Recarga los datos del mapa y los viajes
  }
  

  async ngOnInit() {
    // Obtener usuarios desde el servicio y el usuario autenticado
    const usuarios = await this.usuarioService.obtenerUsuarios();
    const usuarioAutenticado = usuarios.find((usuario: any) => usuario.autenticado === true);
  
    if (!usuarioAutenticado) {
      console.log('No se pudo obtener el usuario autenticado');
      return;
    }
  
    

    // Obtener los viajes y filtrar los que no pertenecen al usuario autenticado
    const todosLosViajes = await this.viajeService.obtenerViajes() || [];
    this.viajes = todosLosViajes.filter((viaje: Viaje) => viaje.userViaje !== usuarioAutenticado.correo);
    
    
  
    // Dibuja mapas y rutas para cada viaje restante
    setTimeout(() => {
      this.viajes.forEach((viaje, index) => {
        const mapa = this.dibujarMapa(viaje, index); // Llama a dibujarMapa y obtiene el mapa
        this.calcularRuta(viaje, mapa); // Pasa el mapa a calcularRuta
        
      });
    }, 0);
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

        // Dibuja el marcador de destino
        new google.maps.Marker({
          position: { lat, lng },
          map: mapa,
        });

        // Calcular y dibujar la ruta
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


  
  async solicitarViaje(viaje: Viaje) {
    const usuarios = await this.usuarioService.obtenerUsuarios();
    const usuarioAutenticado = usuarios.find((usuario) => usuario.autenticado === true);
  
    if (!usuarioAutenticado) {
      console.log('No se pudo obtener el usuario autenticado');
      return;
    }
  
    // Evitar que el usuario solicite su propio viaje
    if (viaje.userViaje === usuarioAutenticado.correo) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No puedes solicitar tu propio viaje.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
  
    // Verificar si el usuario ya solicitó el viaje
    if (viaje.solicitantes?.includes(usuarioAutenticado.correo)) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ya solicitaste este viaje.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
      
    }
  
    // Verificar si hay asientos disponibles
    if (viaje.asientosDisponibles <= 0) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Ya no quedan asientos disponibles.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
  
    // Actualizar el viaje con el correo del solicitante y descontar un asiento
    viaje.asientosDisponibles--;
    if (!viaje.solicitantes) viaje.solicitantes = []; // Inicializar la lista si está indefinida
    viaje.solicitantes.push(usuarioAutenticado.correo);
  
    // Guardar los cambios en el almacenamiento
    await this.viajeService.guardarListaViajes(this.viajes);
  
    // Mostrar confirmación al usuario
    const toast = await this.toastController.create({
      message: 'Solicitud realizada exitosamente',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    this.router.navigate(['/tabs/inicio']);
  }

  irInicio(){
    this.router.navigate(['/tabs/inicio']);
  }

}