import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { VehiculoService, Vehiculo } from 'src/app/services/VehiculoService/vehiculo.service';
import { UsuarioService } from 'src/app/services/UsuarioService/usuario.service';

@Component({
  selector: 'app-registravehiculo',
  templateUrl: './registravehiculo.page.html',
  styleUrls: ['./registravehiculo.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class RegistravehiculoPage implements OnInit {
  registraVehiculoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehiculoService: VehiculoService,
    private usuarioService: UsuarioService,
    private toastController: ToastController,
    private alertController: AlertController,
    private router: Router,
  
  ) {
    this.registraVehiculoForm = this.fb.group({
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      patente: ['', [
        Validators.required,
        Validators.pattern('^(?=[A-Za-z]{2}\\d{4}|[A-Za-z]{4}\\d{2})[A-Za-z]{2}\\d{4}|[A-Za-z]{4}\\d{2}$') // Permite AA1234 o AABB12 en mayúsculas o minúsculas
      ]],
      anio: ['', [
        Validators.required,
        Validators.min(1980), // Año mínimo
        Validators.max(2024) // Año máximo
      ]],
      asientos: ['', [
        Validators.required,
        Validators.min(2), // Capacidad mínima
        Validators.max(5)  // Capacidad máxima
      ]],
      color: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    
  }

  async registrarVehiculo() {
    const f = this.registraVehiculoForm.value;
  
    if (this.registraVehiculoForm.invalid) {
      return;
    }

    // Obtener usuarios desde el servicio
    const usuarios = await this.usuarioService.obtenerUsuarios();
    
    // Aquí puedes obtener el nombre del último usuario que inició sesión
    const usuarioAutenticado = usuarios.find((usuario: any) => usuario.autenticado === true);
    

    const vehiculo:Vehiculo ={
      marca: f.marca,
      modelo: f.modelo,
      patente: f.patente,
      anio: f.anio,
      asientos: f.asientos,
      color: f.color,
      userPropietario: usuarioAutenticado?.username || 'defaultUser'
    };

    try {
      await this.vehiculoService.guardarVehiculo(vehiculo);
      const toast = await this.toastController.create({
        message: 'Vehículo Registrado Correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    
      this.router.navigate(['/tabs/perfil-usuario']);
    } catch (error) {
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Esta patente ya se encuentra registrada', // Mostrar el mensaje del error
        buttons: ['Aceptar'],
      });
      await alert.present();
    }

  }


  convertirAMayusculas(event: any) {
    const input = event.target.value;
    // Convierte el valor a mayusculas y actualiza el formulario
    this.registraVehiculoForm.patchValue({
      patente: input.toUpperCase()
    });
  }


}
