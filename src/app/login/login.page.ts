import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, NavController } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../services/userService/user-service.service';



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
    private userService:UserService
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
  
    var existeUSuario: boolean = this.userService.existeUsuario();
    
    //SI no existen usuarios en la memoria
    if (!existeUSuario) {
      // Si no hay usuario almacenado en localStorage
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay datos de usuario almacenados.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
    
    //obtener formulario
    const f = this.loginForm.value;

    var validaUsuario: boolean=this.userService.validaUSuario(f.correo,f.password);

    // Validar que el usuario y contraseña coincidan con un usuario
    if (validaUsuario) {
      
      this.router.navigate(['/inicio'], { queryParams: { nombre_usuario: f.correo } });
      //ESTA ES LA VARIABLE O FORMA DE EMITIR EL VALOR TRUE AL COMPONENTE "PADRE"
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