import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';

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
    private toastController: ToastController
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
  
    const usuario = {
      nombre: nombreCapitalizado,
      apellido: apellidoCapitalizado,
      username: f.username,
      correo: f.correo,
      password: f.password
    };
  
    // localStorage.setItem('usuario', JSON.stringify(usuario));

    // Obtener usuarios existentes o crear un nuevo arreglo
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    
    //Verificar si el usuario existe
    const usuarioExistente = usuarios.find((u: any) => u.username === usuario.username);
    const correoExistente = usuarios.find((u: any) => u.correo === usuario.correo);

    if (usuarioExistente) {
      const alert = await this.alertController.create({
        header: 'Usuario existente',
        message: 'El nombre de usuario ya está en uso.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
    
    if (correoExistente) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Este correo electrónico ya está en uso.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    // Agregar el nuevo usuario al arreglo
    usuarios.push(usuario);

    // Guardar el arreglo actualizado en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    
    // Mostrar un toast al registro exitoso
    const toast = await this.toastController.create({
      message: 'Alumno Registrado Correctamente',
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();

    this.router.navigate(['login']);
  }

  private primeraLetraMayuscula(string: string): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}
