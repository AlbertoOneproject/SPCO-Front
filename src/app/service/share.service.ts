import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Facturas } from '../model/facturas';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  constructor(private http: HttpClient) { }


//  Función: Consulta de todos los regs de la tabla SYS_EMP
//  Componentes que utilizan el servicio:
//             - altasysuser.component.ts
empresas(){
  return this.http.get<any>(`${environment.SERVER_URL}/Empresa`, {})
    .pipe(map(listEmp => {
    if(listEmp){
    } 
    return listEmp;
    }));
} //Cierre del método empresas


//  Función: Consulta de todos los regs de la tabla SYS_RECINTOS
//  Componentes que utilizan el servicio:
//             - altasysuser.component.ts
recintos(){
  return this.http.get<any>(`${environment.SERVER_URL}/Recintos/Lista`, {})
    .pipe(map(listRecintos => {
    if(listRecintos){
    } 
    return listRecintos;
    }));
} //Cierre del método recintos


//  Función: Consulta de todos los regs de la tabla SYS_PERFILES
//  Componentes que utilizan el servicio:
//             - altasysuser.component.ts
perfiles(emp, rec){
  let constEmp  ="?empresa="
  let constRec  ="&recinto="
  return this.http.get<any>(`${environment.SERVER_URL}/Perfiles`+constEmp+emp+constRec+rec, {})
    .pipe(map(listPerfiles => {
    if(listPerfiles){
    } 
    return listPerfiles;
    }));
} //Cierre del método Perfiles


//  Función: obtiene el Tipo de Cambio de Banco de México
//  Componentes que utilizan el servicio:
//             - altafacturasal.component.ts
tipoCambio(){
  console.log("tipoCambio")
  let constTC   ="TCLinea"
  return this.http.get<any>(`${environment.SERVER_URL}/TipoCambio/`+constTC, {})
    .pipe(map(dataTC => {
    if(dataTC){
    } 
    return dataTC;
    }));
} //Cierre del método tipoCambio

}
