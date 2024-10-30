import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../services/UsuarioService/usuario.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule, 
    FormsModule,
    ReactiveFormsModule,
    
    RouterLink]
})
export class LoginPage {

  loginForm!: FormGroup;

  @ViewChild('logo', {read:ElementRef}) logo?:ElementRef<HTMLImageElement>;
  @ViewChild('text', {read:ElementRef}) text?:ElementRef<HTMLImageElement>;
  
  // OUTPUT PERMITE COMPARTIR DATOS DESDE UN COMPONENTE HIJO A UN PADRE POR MEDIO DE EMISIÓN DE EVENTOS
  @Output() datosAlPadre = new EventEmitter<boolean>();

  constructor(
    private fb:FormBuilder, 
    private router:Router, 
    private alertController:AlertController,
    private usuarioService: UsuarioService
  ) { 
    this.loginForm = this.fb.group({

      correo: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\.cl$'),
      ]],

      
        password: [
        '',
        [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(8),
        Validators.pattern('^[0-9]*$')
        ]
      ]
    });
  } // FIN CONSTRUCTOR




  async onLogin() {
    //Error si el formulario es inválido
    if (this.loginForm.invalid) {
      // Si el formulario es inválido, mostrar un mensaje y no hacer nada
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
    
    // Obtener el formulario
    const f = this.loginForm.value;

    // Verificar si el usuario existe por correo
    const existeUsuario = await this.usuarioService.existeUsuario('', f.correo); // Solo verificamos el correo

    if (!existeUsuario) {
      // Si no hay usuario almacenado en localStorage
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No existe el usuario.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
    
    // Validar que el usuario y contraseña coincidan con un usuario
    const validaUsuario = await this.usuarioService.validaUSuario(f.correo, f.password);

    if (validaUsuario) {
      this.router.navigate(['/tabs/inicio'], { queryParams: { nombre_usuario: f.correo } });
      // Esta es la variable o forma de emitir el valor true al componente "padre"
      this.datosAlPadre.emit(true);
    } else {
      // Si las credenciales no coinciden
      const alert = await this.alertController.create({
        header: 'Datos Inválidos',
        message: 'Ingresa las credenciales correctas.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
    
  }

}