import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';



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
  
    const f = this.loginForm.value;
    const usuariosString: any = localStorage.getItem('usuarios'); 
  
    if (!usuariosString) {
      // Si no hay usuario almacenado en localStorage
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay datos de usuario almacenados.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
  
    const usuarios = JSON.parse(usuariosString);
    
    // Validar que el usuario y la contraseña coincidan con algún usuario almacenado
    const usuarioEncontrado = usuarios.find((usuario: any) => 
      usuario.correo === f.correo && usuario.password === f.password
    );



    // Validar que el nombre de usuario y la contraseña coincidan
    if (usuarioEncontrado) {
      // Marcar este usuario como el que inició sesión
        usuarios.forEach((u: any) => u.ultimoUsuario = false); // Resetear otros usuarios

        usuarioEncontrado.ultimoUsuario = true; // Marcar este usuario

        localStorage.setItem('usuarios', JSON.stringify(usuarios)); // Guardar cambios
        
        //ESTA ES LA VARIABLE O FORMA DE EMITIR EL VALOR TRUE AL COMPONENTE "PADRE"
        this.datosAlPadre.emit(true);

        this.router.navigate(['/inicio'], { queryParams: { nombre_usuario: usuarioEncontrado.nombre } });

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
