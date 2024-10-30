import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface Usuario {
  nombre: string;
  apellido: string;
  username: string;
  correo: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private storage: Storage) { 
    this.init();
  }


  // Inicializa el almacenamiento
  async init() {
    await this.storage.create();
  }

  // Guarda un usuario en el almacenamiento
  async guardarUsuario(usuario: Usuario) {
    const usuarios = await this.obtenerUsuarios();

    // Validar si el usuario ya existe mediante el correo electrónico
    const usuarioExistente = usuarios.find((u: Usuario) => u.correo === usuario.correo);

    if (usuarioExistente) {
      // Si el usuario ya existe, lanzar un error o retornar false
      throw new Error('El correo electrónico ya está en uso.');
    }

    // Si no existe, agregar el nuevo usuario
    usuarios.push(usuario);
    await this.storage.set('usuarios', usuarios);
    return true; // O puedes retornar el nuevo usuario, etc.
  }




  // Obtiene la lista de usuarios del almacenamiento
  async obtenerUsuarios(): Promise<Usuario[]> {
    return (await this.storage.get('usuarios')) || [];
  }



  
  // Verifica si un usuario ya existe
  async existeUsuario(username: string, correo: string): Promise<boolean> {
    const usuarios = await this.obtenerUsuarios();
    return usuarios.some(u => u.username === username || u.correo === correo);
  }

  // Verifica si las credenciales son válidas
  async validaUSuario(correo: string, password: string): Promise<boolean> {
    const usuarios = await this.obtenerUsuarios();
    return usuarios.some(u => u.correo === correo && u.password === password);
  }


}
