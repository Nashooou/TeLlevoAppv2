import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ViajeService, Viaje } from 'src/app/services/ViajeService/viaje.service';
import { UsuarioService } from 'src/app/services/UsuarioService/usuario.service';
import { Router, NavigationEnd } from '@angular/router';

declare var google: any;

@Component({
  selector: 'app-ver-viaje-detalle',
  templateUrl: './ver-viaje-detalle.page.html',
  styleUrls: ['./ver-viaje-detalle.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule
  ]
})
export class VerViajeDetallePage implements OnInit {
  
  key: number = 0; // Clave para forzar la recreación del componente
  viajes: any[] = [];

  constructor(
    private viajeService : ViajeService,
    private usuarioService:UsuarioService,
    private router : Router
  ) { 

  }

  ionViewWillEnter() {
    this.ngOnInit(); // Recarga los datos del viaje
  }


  async ngOnInit() {
    // Obtener los usuarios desde el servicio y el usuario autenticado
    const usuarios = await this.usuarioService.obtenerUsuarios();
    const usuarioAutenticado = usuarios.find((usuario: any) => usuario.autenticado === true);
  
    if (!usuarioAutenticado) {
      console.log('No se pudo obtener el usuario autenticado');
      return;
    }
  
    // Obtener los viajes y filtrar el que pertenece al usuario autenticado
    const todosLosViajes = await this.viajeService.obtenerViajes() || [];
    this.viajes = todosLosViajes.filter((viaje: Viaje) => viaje.userViaje === usuarioAutenticado.correo);
  
    // Dibuja mapas y rutas para el viaje del usuario autenticado, si existe
    setTimeout(() => {
      this.viajes.forEach((viaje, index) => {
        const mapa = this.dibujarMapa(viaje, index); // Llama a dibujarMapa y obtiene el mapa
        this.calcularRuta(viaje, mapa); // Pasa el mapa a calcularRuta
      });
    }, 0);
    this.key++;
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


}
