import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../services/UsuarioService/usuario.service';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterLink, CommonModule,ReactiveFormsModule]
})
export class RecuperarContrasenaPage {
  recuperaForm!: FormGroup;

  constructor(
    private fb:FormBuilder, 
    private router:Router, 
    private alertController:AlertController,
    private usuarioService:UsuarioService,
    private toastController: ToastController,
  ) { 

    //SETEAR VALIDACION DE FORMULARIO
    this.recuperaForm = this.fb.group({
      correo: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\.cl$'),
      ]],
      nuevaContrasena: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      nuevaContrasena2: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]]
    });

  }


  //MÉTODO PARA RECUPERAR O CONTRASEÑA
  async recuperar() {
    const f = this.recuperaForm.value;
    

    //SI EL CORREO ELECTRÓNICO ESTÁ VACIO
    if (this.recuperaForm.get('correo')?.invalid ) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Debes ingresar un correo electrónico.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    // Verificar si el usuario existe por correo
    const existeUsuario = await this.usuarioService.existeUsuario(f.correo); // Solo verificamos el correo

    if (!existeUsuario) {
      // Si no hay usuario almacenado en localStorage
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Este correo no está registrado.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }


    // Obtener el usuario correspondiente
    const usuarios = await this.usuarioService.obtenerUsuarios();
    const usuario = usuarios.find((u) => u.correo === f.correo);

    if (!usuario) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Debes ingresar un correo electrónico registrado.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    
      // Comparar las contraseñas
    if (f.nuevaContrasena !== f.nuevaContrasena2) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }


    // Actualizar la contraseña del usuario
    usuario.password = f.nuevaContrasena;

    // Llamar al método para actualizar el usuario
    const actualizado = await this.usuarioService.actualizarUsuario(usuario);
    if (actualizado) {
      const toast = await this.toastController.create({
        message: 'Contraseña Actualizada Correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      // Redirigir al login
      this.router.navigate(['/login']);

    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo actualizar la contraseña.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}