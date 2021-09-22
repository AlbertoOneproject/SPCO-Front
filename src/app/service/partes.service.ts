import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Partes } from '../model/partes';

@Injectable({
  providedIn: 'root'
})
export class PartesService {
  auth    : String;

  constructor(private http: HttpClient) { }

//  Función: Consulta de todos los Cientes de la tabla SYS_CAT_CLI
//  Componentes que utilizan el servicio:
//             - partes.component.ts
  catClientes(){
    return this.http.get<any>(`${environment.SERVER_URL}/Cli/DifCli`, {})
      .pipe(map(listCtes => {
      if(listCtes){
        console.log("Regreso del catálogo de Clientes")
        console.log(listCtes)
      } 
      return listCtes;
      }));
  } //Cierre del método catClientes


//  Función: Consulta de todos los regs de la tabla SYS_ADU_PART que pertenecen a un cliente
//  Componentes que utilizan el servicio:
//             - partes.component.ts
  PartesCte(idCte, recinto, page, perPage, perName ){
    let constPagLike = 'AduPartPagCte?'
    let constPage = 'page='
    let constPerPage = '&perpage='
    let consCliente = '&cliente='
    let consRecinto = '&recinto='
    this.auth = JSON.parse(localStorage.getItem('autorizacion'));
    console.log("partes.service PArtesCte parámetro")
    console.log("/AduPart/"+constPagLike+constPage+page+constPerPage+perPage+consCliente+idCte+consRecinto+recinto)
    return this.http.get<any>(`${environment.SERVER_URL}/AduPart/`+constPagLike+constPage+page+constPerPage+perPage+consCliente+idCte+consRecinto+recinto, {})
      .pipe(map(listpartes => {
        if(listpartes){
          console.log("regreso de partes")
          console.log(listpartes)
           }       
        return listpartes;
      }));      
  }    // Cierre del método Prodymatid
  
}
