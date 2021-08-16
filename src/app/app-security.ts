import { Injectable } from '@angular/core';
import { Usuario } from './model/usuario';

@Injectable({
  providedIn: 'root'
})

export class AppSecurity {
    usuari: Usuario;
    actualizar: boolean;

  constructor(
  ) {
    this.actualizar = false;
  }

  actualizausr(){
    this.actualizar = false;
    this.usuari = JSON.parse(localStorage.getItem('currentUserLog'));
    let rolePerm = this.usuari["rolePerms"];
    for (let i=0; i < rolePerm.length; i++){ 
        if (rolePerm[i].permissionId == 1 || rolePerm[i].permissionId == 17){
            this.actualizar = true;
        }
    }
    return this.actualizar;
     
  } //Cierre del metodo rolcons

  
}
