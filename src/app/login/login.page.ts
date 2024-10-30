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
  // OUTPUT decorador que se usa para emitir eventos desde un componente hijo hacia su componente padre.
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

    const correoMinuscula = this.todoMinuscula(f.correo);

    // Verificar si el usuario existe por correo
    const existeUsuario = await this.usuarioService.existeUsuario('', correoMinuscula); // Solo verificamos el correo

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
    const validaUsuario = await this.usuarioService.validaUSuario(correoMinuscula, f.password);

    if (validaUsuario) {
      
      // Obtener la lista de usuarios
      const usuarios = await this.usuarioService.obtenerUsuarios();
      const usuario = usuarios.find(u => u.correo === correoMinuscula);

      if (usuario) {
        // Establecer autenticado a true y el resto a false
        usuario.autenticado = true;
  
        // Asegúrate de que los demás usuarios tengan autenticado en false
        usuarios.forEach(u => {
          if (u.correo !== correoMinuscula) {
            u.autenticado = false;
          }
        });
  
        // Guardar el usuario actualizado
        await this.usuarioService.actualizarUsuario(usuario); // Actualiza el usuario específico
      }
      
      // Navegar a la página de inicio
      this.router.navigate(['/tabs/inicio']);
      
      // Emitir el valor true al componente padre
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


  private todoMinuscula(string:string): string{
    return string.toLowerCase();
  }

}