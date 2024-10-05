import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  @Output() datosAlPadre = new EventEmitter<boolean>();

  constructor(

    private router:Router
    
    ) { }

  //MÉTODO PARA VALIDAR SI EXISTEN USUARIOS REGISTRADOS
  existeUsuario():boolean{

    const usuariosString = localStorage.getItem('usuarios'); 

    if (!usuariosString) {
      return false;

    }else{

      return true;

    }
  } // fin de existeUsuario


  //MÉTODO PARA VALIDAR SI EL USUARIO EXISTE
  validaUSuario(username:string,clave:number) : boolean{

    
    // Aquí puedes obtener el nombre del último usuario que inició sesión
    // Si necesitas obtener un usuario específico, deberías pasar la lógica de identificación
    // const usuarioAutenticado = usuarios.find((usuario: any) => usuario.ultimoUsuario === true);

    //OBtener los usuarios desde memoria navegador
    const usuariosString = localStorage.getItem('usuarios'); 

    //Si existen usuarios en memoria los obtiene en usuarios en formato String
    if(usuariosString){
      const usuarios = JSON.parse(usuariosString);
      
      // Validar que el usuario y la contraseña coincidan con algún usuario almacenado
      const usuarioEncontrado = usuarios.find((usuario: any) => 
        usuario.correo === username && usuario.password === clave
      );

      //Si el usuario fue encontrado
      if(usuarioEncontrado){
        usuarios.forEach((u: any) => u.ultimoUsuario = false); // Resetear el estado de todos los usuarios
        
        usuarioEncontrado.ultimoUsuario = true; // Marcar el usuario encontrado
        
        localStorage.setItem('usuarios', JSON.stringify(usuarios)); // Guardar cambios en memoria
        
        return true;

      }else{

        return false;

      }

    }else{

      return false;

    }
  }// fin de validaUsuario




}
