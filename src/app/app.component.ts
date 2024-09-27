import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, heartOutline, heartSharp, archiveOutline, archiveSharp, trashOutline, trashSharp, warningOutline, warningSharp, bookmarkOutline, bookmarkSharp } from 'ionicons/icons';

import { LoginPage } from './login/login.page';

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

  constructor(private router: Router) {
    this.showMenu = false;
    
  
  }

  //DECLARAR VARIABLA QUE PERMITE ACCEDER A LAS RUTAS (IONROUTEROUTLET)
  @ViewChild(IonRouterOutlet, { static: true }) outlet!: IonRouterOutlet;

  //SE EJECUTA LUEGO DE QUE LA VISTA SE INICIA
  ngAfterViewInit() {
    //CREA UNA SUBSCRIPCIÓN PARA "MIRAR VARIABLE" PARA CUANDO EMITE UN VALOR O CAMBIA DE ESTADO
    this.outlet.activateEvents.subscribe((component) => {
      //CUANDO EL LOGIN ES EXITOSO EMITE UN NUEVO VALOR O CAMBIA EL ESTADO DE UNA VARIABLE
      //SI EL COMPONENTE QUE EMITIÓ EL VALOR ES EL LOGINPAGE NOS VOLVEMOS A SUSCRIBIR A LA VARIABLE "DATOS DEL PADRE" QUE EMITE UN VALOR BOOL
      if (component instanceof LoginPage) {
        component.datosAlPadre.subscribe((valor) => { this.showMenu = valor;});
      }
    });
  }




  clickOpcionMenu(link: string) {
    if (link == "/login") {
      this.showMenu = false;
      // localStorage.removeItem("usuarios");
      this.router.navigate(['login']);
    }
    else {
      this.showMenu = true;
    }
  }


}