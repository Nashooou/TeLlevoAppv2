import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.page.html',
  styleUrls: ['./recuperar-contrasena.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, RouterLink, CommonModule,ReactiveFormsModule]
})
export class RecuperarContrasenaPage {
  recuperaForm!: FormGroup;

  constructor(private fb:FormBuilder, private router:Router, private alertController:AlertController) { 
    //SETEAR VALIDACION DE FORMULARIO
    this.recuperaForm = this.fb.group({
      correo: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@duocuc\.cl$'),
      ]],
      nuevaContrasena: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]],
      nuevaContrasena2: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ]]
    });

  }


  //MÉTODO PARA RECUPERAR O CONTRASEÑA
  async recuperar() {
    const f = this.recuperaForm.value;
    const usuariosString: any = localStorage.getItem('usuarios');

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

    //SI NO EXISTEN USUARIOS
    if (!usuariosString) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No hay usuarios almacenados.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    const usuarios = JSON.parse(usuariosString);
    const usuario = usuarios.find((u: any) => u.correo === f.correo);

    // Si el correo no existe
    if (!usuario) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Debes ingresar un correo electrónico registrado.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    
    }else{
      
      //SI EL CORREO EXISTE COMPARA LAS CONTRASEÑAS

      if (f.nuevaContrasena !== f.nuevaContrasena2){
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Las contraseñas no coinciden',
          buttons: ['Aceptar'],
        });
        await alert.present();
        return;
        
      } else {

        //SI LAS CONTRASEÑAS COINCIDEN ACTUALIZA LA CONTRASEÑA DEL USUARIO
        usuario.password = f.nuevaContrasena;

        // Guardar el arreglo actualizado en localStorage
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'Contraseña actualizada correctamente.',
          buttons: ['Aceptar'],
        });
        await alert.present();

        // Redirigir al login
        this.router.navigate(['/login']);
        }

    }
    
    
  }


}