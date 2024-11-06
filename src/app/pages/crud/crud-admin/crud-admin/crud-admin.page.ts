import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { UsuarioService, Usuario } from 'src/app/services/UsuarioService/usuario.service';
import { VehiculoService } from 'src/app/services/VehiculoService/vehiculo.service';
import { ViajeService } from 'src/app/services/ViajeService/viaje.service';

@Component({
  selector: 'app-crud-admin',
  templateUrl: './crud-admin.page.html',
  styleUrls: ['./crud-admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class CrudAdminPage implements OnInit {

  usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private vehiculoService: VehiculoService,
    private viajeService: ViajeService,
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  async cargarUsuarios() {
    this.usuarios = await this.usuarioService.obtenerUsuarios();
  }

  async eliminarUsuario(correo: string) {


    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Estás seguro de que deseas eliminar al usuario con correo ${correo}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: async () => {
            // Elimina el usuario y actualiza la lista
            const usuarios = await this.usuarioService.obtenerUsuarios();
            const indexUsuario = usuarios.findIndex(u => u.correo === correo);

            if (indexUsuario !== -1) {
              usuarios.splice(indexUsuario, 1); // Elimina el usuario
              await this.usuarioService.guardarListaUsuarios(usuarios); // Actualiza la lista de usuarios
            }

            // Eliminar vehículos del usuario
            const vehiculos = await this.vehiculoService.obtenerVehiculos();
            const vehiculosFiltrados = vehiculos.filter(v => v.userPropietario !== correo);
            await this.vehiculoService.guardarListaVehiculos(vehiculosFiltrados); // Actualiza la lista de vehículos

            // Eliminar viajes del usuario
            const viajes = await this.viajeService.obtenerViajes();
            const viajesFiltrados = viajes.filter(v => v.userViaje !== correo);
            await this.viajeService.guardarListaViajes(viajesFiltrados); // Actualiza la lista de viajes

            const toast = await this.toastController.create({
              message: 'Usuario Eliminado Correctamente',
              duration: 2000,
              color: 'danger',
              position: 'bottom'
            });
            await toast.present();

            // Recargar los usuarios para reflejar los cambios
            this.cargarUsuarios();
          },
        },
      ],
    });

    await alert.present();
  }

  async clickOpcionMenu() {
    window.location.href = '/login';
    
  }
} 
