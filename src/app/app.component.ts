import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';

import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { home, personCircleSharp, logOut, gridSharp } from 'ionicons/icons';

import { LoginPage } from './login/login.page';
import { UsuarioService } from './services/UsuarioService/usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    RouterLink, 
    RouterLinkActive, 
    CommonModule, 
    IonApp, 
    IonSplitPane, 
    IonMenu, 
    IonContent, 
    IonList, 
    IonListHeader, 
    IonNote, 
    IonMenuToggle, 
    IonItem, 
    IonIcon, 
    IonLabel, 
    IonRouterLink, 
    IonRouterOutlet
  ],
})
export class AppComponent {
  showMenu: boolean = false;
  isAutenticado: boolean = false;
  par_nombre: string = "Login";


  constructor(
    private router: Router,
    private usuarioService:UsuarioService,
    
  ) {
    // this.showMenu = false;
    // Registro de íconos
    
    addIcons({
      'home': home,
      'person' : personCircleSharp,
      'logout': logOut
    });
  
  }

  //DECLARAR VARIABLA QUE PERMITE ACCEDER A LAS RUTAS (IONROUTEROUTLET)
  // @ViewChild(IonRouterOutlet, { static: true }) outlet!: IonRouterOutlet;

  //SE EJECUTA LUEGO DE QUE LA VISTA SE INICIA
  async ngAfterViewInit() {
    const isAutenticado= await this.usuarioService.usuarioAutenticado();


    

    if(isAutenticado){
      this.showMenu = true
    }
    
    // //CREA UNA SUBSCRIPCIÓN AL EVENTO PARA "MIRAR VARIABLE" CUANDO CAMBIA DE ESTADO
    // this.outlet.activateEvents.subscribe((component) => {
    //   //si ese componente es LoginPage, te suscribes al evento datosAlPadre
    //   if (component instanceof LoginPage) {
    //     //Cuando el evento es emitido, se ejecuta la función de callback y puedes manejar 
    //     //el valor recibido (true en este caso) para actualizar el estado
    //     // en el componente padre (por ejemplo, mostrando u ocultando un menú).
    //     component.datosAlPadre.subscribe((valor) => { this.showMenu = valor;});
    //   }
    // });
  }


  async clickOpcionMenu(link: string) {
    if (link == "/login") {
      this.showMenu = false;
      
      
      const usuarios = await this.usuarioService.obtenerUsuarios();
      usuarios.forEach(u => {
          u.autenticado = false;
      });

      await this.usuarioService.guardarListaUsuarios(usuarios);
      window.location.href = '/login';
      // this.router.navigate(['login']);
    }
    else {
      this.showMenu = true;
    }
  }


}