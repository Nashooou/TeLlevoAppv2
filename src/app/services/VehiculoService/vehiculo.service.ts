import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Vehiculo {
  marca: string;
  modelo: string;
  patente: string;
  anio: number;
  asientos:number;
  color: string;
  userPropietario: string | undefined;

}



@Injectable({
  providedIn: 'root'
})
export class VehiculoService {

  constructor(
    private storage:Storage
  ) { 
    this.init();
  
  }


  // Inicializa el almacenamiento
  async init() {
    await this.storage.create();
  }

  async guardarVehiculo(vehiculo: Vehiculo) {
    const vehiculos = await this.obtenerVehiculos();

    // Validar si el usuario ya existe mediante el correo electrónico
    const vehiculoExistente = vehiculos.find((v: Vehiculo) => v.patente === vehiculo.patente);

    if (vehiculoExistente) {
      // Si el usuario ya existe, lanzar un error o retornar false
      throw new Error('Esta patente ya está registrada.');
    }

    // Si no existe, agregar el nuevo usuario
    vehiculos.push(vehiculo);
    await this.storage.set('vehiculos', vehiculos);
    return true;
  }


  async guardarListaVehiculos(vehiculos: Vehiculo[]) {
    await this.storage.set('vehiculos', vehiculos);
  }

  
  // Obtiene la lista de usuarios del almacenamiento
  async obtenerVehiculos(): Promise<Vehiculo[]> {
    return (await this.storage.get('vehiculos')) || [];
  }


  

}
