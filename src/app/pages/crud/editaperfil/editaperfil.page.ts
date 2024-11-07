import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule, ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from 'src/app/services/UsuarioService/usuario.service';

@Component({
  selector: 'app-editaperfil',
  templateUrl: './editaperfil.page.html',
  styleUrls: ['./editaperfil.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class EditaperfilPage  {
  
  editaFormAlumno!: FormGroup;

  usuario: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private usuarioService : UsuarioService,
    private toastController : ToastController
  ) { 
    //Validación Formulario
    this.editaFormAlumno = this.fb.group({
      currentPassword: ['',[
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      password2: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(10),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]]
    });
  }

  async ngOnInit() {

    
    const usuarios = await this.usuarioService.obtenerUsuarios();
    
    
    const usuarioAutenticado = usuarios.find((usuario: any) => usuario.autenticado === true);
    
    if (usuarioAutenticado) {
      
      this.usuario = usuarioAutenticado;
    }else{
      console.log("No se pudo obtener el usuario autenticado")
    }
    
  }


  async guardarCambios() {
    if (this.editaFormAlumno.invalid) {
      // Si el formulario es inválido, mostrar un mensaje y no hacer nada
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
  
    const f = this.editaFormAlumno.value;
  
    const usuarios = await this.usuarioService.obtenerUsuarios();
  
    if (usuarios.length === 0) {
      
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay datos de usuario almacenados.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
  
    
    if (f.password !== f.password2) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }
  
    
    if (this.usuario.password === f.currentPassword) {
      
      const usuarioIndex = usuarios.findIndex(u => u.correo === this.usuario.correo);
      
      if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].password = f.password; 
  
        await this.usuarioService.actualizarUsuario(usuarios[usuarioIndex]); 
      }
  
      const toast = await this.toastController.create({
        message: 'Contraseña actualizada Correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();
      
      this.router.navigate(['/tabs/perfil-usuario']);
  
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'La contraseña actual no es correcta.',
        buttons: ['Aceptar'],
      });
      await alert.present();
    }
  }
}