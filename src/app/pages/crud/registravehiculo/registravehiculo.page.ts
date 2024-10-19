import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registravehiculo',
  templateUrl: './registravehiculo.page.html',
  styleUrls: ['./registravehiculo.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegistravehiculoPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
