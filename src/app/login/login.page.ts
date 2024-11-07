import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnimationController } from '@ionic/angular/standalone';
import { AlertController, IonicModule,Animation } from '@ionic/angular';
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
  @ViewChild('card', {read:ElementRef}) card?:ElementRef<HTMLImageElement>;
  
  private logoAnimation!:Animation; 
  private cardAnimation!:Animation;

  constructor(
    private fb:FormBuilder, 
    private router:Router, 
    private alertController:AlertController,
    private usuarioService: UsuarioService,
    private animationCtrl:AnimationController
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
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern('^[a-zA-Z0-9]+$')
        ]
      ]
    });
  } // FIN CONSTRUCTOR

  


  ngAfterViewInit() {
    if(this.logo?.nativeElement && this.card?.nativeElement) {
      this.logoAnimation =this.animationCtrl.create()
      .addElement(this.logo.nativeElement)
      .duration(5000)
      .fromTo('opacity','0','1');

      this.cardAnimation =this.animationCtrl.create()
      .addElement(this.card.nativeElement)
      .duration(1000)
      .fromTo('transform','translateY(20px)', 'translateY(0)');

      this.logoAnimation.play()
      this.cardAnimation.play()


    } // final If
      else{
        console.error('Los elementos no fueron encontrados')
      }


  } // final After


  async onLogin() {
    
    if (this.loginForm.invalid) {
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
    
    
    const f = this.loginForm.value;
    const correoMinuscula = this.todoMinuscula(f.correo);


    if(f.correo === 'admin@duocuc.cl' && f.password === 'admin'){
      this.router.navigate(['/crud-admin']);
      return;
    }

    
    const existeUsuario = await this.usuarioService.existeUsuario(correoMinuscula); // Solo verificamos el correo

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
    
    
    const validaUsuario = await this.usuarioService.validaUSuario(correoMinuscula, f.password);

    if (validaUsuario) {
      
      
      const usuarios = await this.usuarioService.obtenerUsuarios();
      const usuario = usuarios.find(u => u.correo === correoMinuscula);

      if (usuario) {
        
        usuario.autenticado = true;
  
        
        usuarios.forEach(u => {
          if (u.correo !== correoMinuscula) {
            u.autenticado = false;
          }
        });
  
        
        await this.usuarioService.actualizarUsuario(usuario);
      }
      
      // Navegar a la página de inicio recargando la vista para que cargue todos los datos de 0
      window.location.href = '/tabs/inicio';
      

    } else {
      
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