import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ViajeService, Viaje } from 'src/app/services/ViajeService/viaje.service';
import { IonicModule } from '@ionic/angular';
import { Router, NavigationEnd, RouterLink} from '@angular/router';

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
  

  constructor(
    private viajeService : ViajeService,
    private router : Router
  ) { 
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && this.router.url === '/tabs/buscarviaje') {
        this.ngOnInit(); // Recargar los datos del usuario y el vehículo al navegar de nuevo a la página
      }
    });
  }

  async ngOnInit() {
    this.viajes = await this.viajeService.obtenerViajes() || [];
    console.log('Viajes recuperados:', this.viajes);

    // Dibuja mapas y rutas para cada viaje
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
}