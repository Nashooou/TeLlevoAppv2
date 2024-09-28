import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AlertController, IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

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
    private alertController: AlertController
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

  ngOnInit() {
    // Obtener los datos de todos los usuarios desde localStorage
    const usuariosData = localStorage.getItem('usuarios');
    
    if (usuariosData) {
      const usuarios = JSON.parse(usuariosData);
      
      // Buscar el usuario que ha iniciado sesión
      const ultimoUsuarioAutenticado = usuarios.find((usuario: any) => usuario.ultimoUsuario === true);

      if (ultimoUsuarioAutenticado) {
        this.usuario = ultimoUsuarioAutenticado; // Asignar el usuario encontrado
      }

    }
  }


  async guardarCambios(){
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



    const usuarios = JSON.parse(usuariosString); // Convertir a un array de objetos

    // Validar si las nuevas contraseñas coinciden
    if (f.password !== f.password2) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Las contraseñas no coinciden.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      return;
    }

    // Validar la contraseña actual
    if (this.usuario.password === f.currentPassword) {
      // Actualizar la contraseña del usuario autenticado
      const usuarioIndex = usuarios.findIndex((u: any) => u.correo === this.usuario.correo);
      
      if (usuarioIndex !== -1) {
        usuarios[usuarioIndex].password = f.password; // Actualizar la contraseña en el array de usuarios
      }

      // Guardar el array actualizado de usuarios en localStorage
      localStorage.setItem('usuarios', JSON.stringify(usuarios));

      const alert = await this.alertController.create({
        header: 'Éxito',
        message: 'Contraseña actualizada correctamente.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      // Redirigir a página anterior (descomentar si tienes la ruta configurada)
      this.router.navigate(['/perfil-usuario']);

      
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