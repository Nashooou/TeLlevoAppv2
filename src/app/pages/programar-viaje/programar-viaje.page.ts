import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { ViajeService, Viaje } from 'src/app/services/ViajeService/viaje.service';
import { UsuarioService } from 'src/app/services/UsuarioService/usuario.service';
import { ToastController } from '@ionic/angular/standalone';

//declarar una variable de google
declare var google:any;


@Component({
  selector: 'app-programar-viaje',
  templateUrl: './programar-viaje.page.html',
  styleUrls: ['./programar-viaje.page.scss'],
  standalone: true,
  imports: [
    IonicModule, 
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class ProgramarViajePage implements OnInit {
  
  programarForm!: FormGroup;


  // declarar variables de trabajo del mapa
  mapa:any;
  marker:any;
  puntoreferencia={lat:-33.59820977053813 , lng:-70.57869509997039 } //latitud y longitud
  search:any;
//variable para calcular 2 puntos
  directionsService:any;
  directionsRenderer:any;


  constructor(

    private fb: FormBuilder,
    private viajeService: ViajeService,
    private usuarioService: UsuarioService,
    private toastController:ToastController,
    private router: Router
  ) { 
    this.programarForm = this.fb.group({
      hora: ['', [Validators.required]],
      asientosDisponibles: ['', 
        [
          Validators.required, 
          Validators.min(1), 
          Validators.max(4)
        ]],
      precio: ['', [
        Validators.required, 
        Validators.min(0)
      ]],
      destino: ['',Validators.required]
    });
  }

  async onSubmit() {



    if (this.programarForm.valid) {
      // Obtener usuarios desde el servicio
      const usuarios = await this.usuarioService.obtenerUsuarios();
      
      // Aquí puedes obtener el nombre del último usuario que inició sesión
      const usuarioAutenticado = usuarios.find((usuario: any) => usuario.autenticado === true);
      
      if(!usuarioAutenticado){
        console.log('No se encuentran usuarios autenticados')
        return;
      }

      // Obtenemos el destino del autocomplete
      const place = this.search.getPlace();
      const destino = place.geometry.location; // Coordenadas del destino


      // Creamos el objeto viaje incluyendo las coordenadas
      const viaje: Viaje = {
        hora: this.programarForm.get('hora')?.value,
        asientosDisponibles: this.programarForm.get('asientosDisponibles')?.value,
        precio: this.programarForm.get('precio')?.value,
        destino: place.formatted_address, // Puedes usar el nombre del lugar
        destinoCoordenadas: {
          lat: destino.lat(), // Latitud
          lng: destino.lng()  // Longitud
        },
        origen: this.puntoreferencia,
        userViaje: usuarioAutenticado.correo,
        solicitantes:[]
      };

      

      await this.viajeService.guardarViaje(viaje);
      const toast = await this.toastController.create({
        message: 'Viaje Programado Correctamente',
        duration: 2000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

      this.router.navigate(['/tabs/inicio']);

    } else {
      console.log('Formulario inválido');
      this.programarForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los errores
    }
  }


  ngOnInit() {
    this.dibujarMapa()
    this.buscaDireccion(this.mapa,this.marker)

  }

  dibujarMapa(){
    var mapElement=document.getElementById('map')

    // valido que que la variable existe
    if(mapElement){

      // crea un nuevo mapa
      this.mapa= new google.maps.Map(
        mapElement,
        {
          center:this.puntoreferencia,
          zoom:15 // 1 a 25
        });

      this.marker =  new google.maps.Marker(
        {
          position: this.puntoreferencia,
          map:this.mapa
        }
      )};

      // inicializo las variables para calcular

      this.directionsService=new google.maps.DirectionsService();
      this.directionsRenderer=new google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.mapa)

      // variables para leer caja de instrucciones
      var trayecto =document.getElementById('trayecto') as HTMLInputElement | null;
      this.directionsRenderer.setPanel(trayecto);



  } // fin dibujar mapa


  buscaDireccion(mapaLocal: any, marcadorLocal: any) {
    var input = document.getElementById('autocomplete');
  
    if (input) {
      const autocomplete = new google.maps.places.Autocomplete(input);
      this.search = autocomplete;
  
      // Agregamos el listener para detectar cambios en el lugar seleccionado
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
  
        // Validamos si el lugar tiene coordenadas válidas
        if (place.geometry && place.geometry.location) {
          const destino = place.geometry.location;
  
          // Centrar el mapa y ajustar el marcador
          mapaLocal.setCenter(destino);
          mapaLocal.setZoom(13);
          marcadorLocal.setPosition(destino);
  
          // Llamar a calculaRuta para trazar la ruta
          this.calculaRuta();
        } else {
          alert('El lugar seleccionado no tiene coordenadas válidas.');
        }
      });
    } else {
      alert("Elemento con id=autocomplete no encontrado");
    }
  }



  calculaRuta() {
  const origen = this.puntoreferencia;

    // Obtenemos el destino desde `this.search`
    if (this.search && this.search.getPlace() && this.search.getPlace().geometry) {
      const destino = this.search.getPlace().geometry.location;

      const request = {
        origin: origen,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.directionsService.route(request, (result: any, status: any) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.directionsRenderer.setDirections(result);
        } else {
          alert('Error al calcular ruta');
        }
        this.marker.setPosition(null);
      });
    } else {
      alert('El destino no está definido correctamente.');
    }

  }
}
