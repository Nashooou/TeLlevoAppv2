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
      marca: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-ZÀ-ÿ]+$')
      ]],
      modelo: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-ZÀ-ÿ0-9 ]+$')
      ]],
      patente: ['', [
        Validators.required,
        Validators.pattern('^(?=[A-Za-z]{2}\\d{4}|[A-Za-z]{4}\\d{2})[A-Za-z]{2}\\d{4}|[A-Za-z]{4}\\d{2}$') // Permite AA1234 o AABB12 en mayúsculas o minúsculas
      ]],
      anio: ['', [
        Validators.required,
        Validators.min(1970), // Año mínimo
        Validators.max(2024) // Año máximo
      ]],
      asientos: ['', [
        Validators.required,
        Validators.min(1), // Capacidad mínima
        Validators.max(5),        
      ]],
      color: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-ZÀ-ÿ]+$')  // Permite letras mayúsculas, minúsculas y letras acentuadas
    ]]
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
    

    if (!usuarioAutenticado) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se encuentra usuario autenticado.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    if(usuarioAutenticado.tieneAuto){
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usted ya posee un vehículo registrado',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
    
    const marcaCapitalizada = this.primeraLetraMayuscula(f.marca);
    const modeloCapitalizada = this.primeraLetraMayuscula(f.modelo);
    const colorCApitalizada = this.primeraLetraMayuscula(f.color);
    
    
    const vehiculo:Vehiculo ={
      marca: marcaCapitalizada,
      modelo: modeloCapitalizada,
      patente: f.patente,
      anio: f.anio,
      asientos: f.asientos,
      color: colorCApitalizada,
      userPropietario: usuarioAutenticado.correo || 'defaultUser'
    };

    try {
      await this.vehiculoService.guardarVehiculo(vehiculo);

      // Actualizar el atributo `tieneAuto` del usuario autenticado
      usuarioAutenticado.tieneAuto = true;
      await this.usuarioService.actualizarUsuario(usuarioAutenticado);

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

  private primeraLetraMayuscula(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


}
