import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';

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
    private fb: FormBuilder
  ) { 
    this.programarForm = this.fb.group({
      hora: ['', [Validators.required]],
      asientosDisponibles: [null, 
        [
          Validators.required, 
          Validators.min(1), 
          Validators.max(10)
        ]],
      precio: ['', [
        Validators.required, 
        Validators.min(0)
      ]],
      destino: ['',Validators.required]
    });
  }

  onSubmit() {
    if (this.programarForm.valid) {
      console.log('Formulario válido', this.programarForm.value);
      // Aquí puedes manejar la lógica para enviar los datos
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


  buscaDireccion(mapaLocal:any,marcadorLocal:any){
    var input=document.getElementById('autocomplete')

    if(input){
      const autocomplete=new google.maps.places.Autocomplete(input);
      this.search=autocomplete;

      // Agregamos el movimiento al mapa
     autocomplete.addListener('place_changed',function(){
     const place=autocomplete.getPlace().geometry.location;  // lat y long del texto de la caja
     mapaLocal.setCenter(place); 
     mapaLocal.setZoom(13);
     marcadorLocal.setPosition(place); 

     });



     }else {
      alert("Elemento con id=autocomplete no encontrado");
     }// fin if


     
  } // fin busca direccion

  calculaRuta(){
    //alert('Calculo de la ruta en progreso');

    const origen=this.puntoreferencia;
    const destino=this.search.getPlace().geometry.location;


    const  request={
      origin: origen,
      destination:destino,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.directionsService.route(request,
          (result:any,status:any) =>{
            if (status === google.maps.DirectionsStatus.OK){
              this.directionsRenderer.setDirections(result)
            }else{
              alert('Error al calcular ruta');
            }
            this.marker.setPosition(null)

          }
        
        
        
        
        )//fin result service







  } // fin calcula ruta
}
