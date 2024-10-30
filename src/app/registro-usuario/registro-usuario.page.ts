import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService, Usuario } from '../services/UsuarioService/usuario.service';



@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.page.html',
  styleUrls: ['./registro-usuario.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class RegistroUsuarioPage implements OnInit {
  registraForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private usuarioService: UsuarioService
  ) {
    this.registraForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      correo: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\.cl$'),
      ]],
      username: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9]+$'),
        Validators.minLength(4),
        Validators.maxLength(8),
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      password2: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]]
    });
  }

  ngOnInit() {}

  async onRegister() {
    const f = this.registraForm.value;
  
    if (this.registraForm.invalid) {
      return;
    }
  

    if (f.password !== f.password2) {
      const alert = await this.alertController.create({
        header: 'Datos inválidos',
        message: 'Las contraseñas no coinciden',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
  
    const nombreCapitalizado = this.primeraLetraMayuscula(f.nombre);
    const apellidoCapitalizado = this.primeraLetraMayuscula(f.apellido);
    const usuarioMinuscula = this.todoMinuscula(f.username);
    const correoMinuscula = this.todoMinuscula(f.correo);

    //Crear objeto usuario
    const usuario: Usuario = {
      nombre: nombreCapitalizado,
      apellido: apellidoCapitalizado,
      username: usuarioMinuscula,
      correo: correoMinuscula,
      password: f.password,
      autenticado: false,
    };

    // Verificar si el usuario existe
    const existe = await this.usuarioService.existeUsuario(usuario.username, usuario.correo);
    if (existe) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'El nombre de usuario o correo ya está en uso.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }


    try {
      await this.usuarioService.guardarUsuario(usuario);
      const toast = await this.toastController.create({
        message: 'Alumno Registrado Correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
    
      this.router.navigate(['login']);
    } catch (error) {
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Usuario no pudo ser registrado, avise al administrador', // Mostrar el mensaje del error
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  
  }


  private todoMinuscula(string:string): string{
    return string.toLowerCase();
  }

  private primeraLetraMayuscula(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}
