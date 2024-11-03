import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';


export interface Viaje {
  hora: string;
  asientosDisponibles: number;
  precio: number;
  destino: string;
  destinoCoordenadas: { lat: number; lng: number }; // Agrega este campo
  origen: { lat: number; lng: number };
  userViaje: string;
}


@Injectable({
  providedIn: 'root'
})
export class ViajeService {
  
  


  constructor(private storage: Storage) {
    this.init();
  }

  // Inicializa el almacenamiento
  async init() {
    await this.storage.create();
  }

  // Guarda un nuevo viaje
  async guardarViaje(viaje: Viaje) {
    const viajes = await this.obtenerViajes();
    viajes.push(viaje);
    await this.storage.set('viajes', viajes);
  }

  async obtenerViajes(): Promise<Viaje[]> {
    return (await this.storage.get('viajes')) || [];
  }

}
