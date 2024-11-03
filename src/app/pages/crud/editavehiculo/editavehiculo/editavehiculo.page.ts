import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { VehiculoService } from 'src/app/services/VehiculoService/vehiculo.service';
import { Router, RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-editavehiculo',
  templateUrl: './editavehiculo.page.html',
  styleUrls: ['./editavehiculo.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class EditavehiculoPage implements OnInit {
  patente:any;
  editaFormVehiculo!: FormGroup;
  vehiculo:any;

  constructor(
    private fb: FormBuilder,
    private vehiculoService: VehiculoService,
    private router:Router,
    private alertController: AlertController,
    private toastController: ToastController
    
  ) {
    
    this.editaFormVehiculo = this.fb.group({
      newColor:['',[
        Validators.required,
        Validators.pattern('^[a-zA-ZÀ-ÿ]+$')
      ]],
      newAsientos: ['',[
        Validators.min(2), // Capacidad mínima
        Validators.max(5),
        Validators.maxLength(1),
        
      ]]
    });

    
   }



  async ngOnInit() {

    const navigation=this.router.getCurrentNavigation();
    
    if (navigation && navigation.extras.state){
        this.patente =navigation.extras.state['patente'];

    }else{
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo obtener el state de la navegación.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    const vehiculos = await this.vehiculoService.obtenerVehiculos();
    const vehiculoObj = vehiculos.find((vehiculo: any) => vehiculo.patente === this.patente);

    if(vehiculoObj){
      this.vehiculo = vehiculoObj;
    }


  }

  async guardarCambios() {

    const f = this.editaFormVehiculo.value;

    if (this.editaFormVehiculo.invalid) {
      return;
    }

    const colorCapitalizada=this.primeraLetraMayuscula(f.newColor);


    try {
      if (this.vehiculo) {
        // Actualizar el objeto del vehículo con los nuevos datos del formulario
        this.vehiculo.color = colorCapitalizada;
        this.vehiculo.asientos = this.editaFormVehiculo.value.newAsientos;
  
        // Obtener la lista completa de vehículos, y buscar el índice del vehículo a actualizar
        const vehiculos = await this.vehiculoService.obtenerVehiculos();
        const vehiculoIndex = vehiculos.findIndex((v: any) => v.patente === this.patente);
  
        if (vehiculoIndex > -1) {
          // Reemplazar el vehículo actualizado en la lista y guardar la lista completa
          vehiculos[vehiculoIndex] = this.vehiculo;
          await this.vehiculoService.guardarListaVehiculos(vehiculos);
        }

        // Mostrar un mensaje de éxito
        const toast = await this.toastController.create({
          message: 'Datos Actualizados Correctamente',
          duration: 2000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
      
        // Redirigir o realizar alguna acción adicional si es necesario
        this.router.navigate(['/tabs/perfil-usuario']);
      }
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudieron guardar los cambios.',
        buttons: ['Aceptar']
      });
      await alert.present();
    }
  }

  private primeraLetraMayuscula(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }


}
