import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Catprod, Cteyprov } from '../model';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CteyprovService {
  auth: String;
  cteyprov: Cteyprov
  constructor(private http: HttpClient) { }

    //  Consulta de todos los Tipos de Productos
  catCteyProv(){
      //return this.http.get<Sysdtapl>(`${environment.SERVER_URL}/CatProd`, {})
      return this.http.get<any>(`${environment.SERVER_URL}/Cli/TiposCli`, {})
        .pipe(map(listprod => {
          if(listprod){
          } 
        return listprod;
        }));
  } //Cierre del método catCteyprov

  Cteyprovid(cveTipo, page, perPage, perName ){
    console.log("cteyprov.service.ts Cteyprovid cveTipo")
    console.log(cveTipo);
        let constPagLike = 'TipoCli?'
        let constPage = 'page='
        let constPerPage = '&perpage='
        let consTipo = '&tipo='       
        this.auth = JSON.parse(localStorage.getItem('autorizacion'));
        console.log("/Cli/"+constPagLike+constPage+page+constPerPage+perPage+consTipo+cveTipo)
        return this.http.get<any>(`${environment.SERVER_URL}/Cli/`+constPagLike+constPage+page+constPerPage+perPage+consTipo+cveTipo, {})
          .pipe(map(listctes => {
            if(listctes){
              console.log("lo que egreso es....")
              console.log(listctes)
               }       
            return listctes;
          }));      
  }    // Cierre del método Prodymatid
  
  //apeconscveidid(cveap: string, id1:string, id2:string){   
  cteyprovUnico(opc: string,idCliProv: string){
        let constPagLike = 'Cliente?'
        let consCteyprov = 'Id='
        let constOpc = '&Opc='
        console.log("cteyprov.service cteyprovUnico parámetros")
        console.log("/Cli/"+constPagLike+consCteyprov+idCliProv+constOpc+opc)
        return this.http.get<any>(`${environment.SERVER_URL}/Cli/`+constPagLike+consCteyprov+idCliProv+constOpc+opc, {})
          .pipe(map(listcte => {
            if(listcte){
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              console.log("cteyprov.service cteyprovUnico listcte")
              console.log(listcte)
               }       
            return listcte;
          }));      
      }    // Cierre del método Prodymatid

  obtenCP(cp){
    let constPagLike = 'CPMultiple?'
    let consCteyprov = 'cp='
    console.log("cteyprov.service cteyprovUnico parámetros")
    console.log("/CP/"+constPagLike+consCteyprov+cp)
        return this.http.get<any>(`${environment.SERVER_URL}/CP/`+constPagLike+consCteyprov+cp, {})
          .pipe(map(listcp => {
            if(listcp){
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              console.log("cteyprov.service obtenCP listcp")
              console.log(listcp)
               }       
            return listcp;
          }));      
  }    // Cierre del método obtenCP      

  altacteyprov(cteyprov: Cteyprov){
    return this.http.post<Cteyprov>(`${environment.SERVER_URL}/Cli`,cteyprov)
          .pipe(map(datapost => {
    return datapost;
    }));
  }   
  
  editcteyprov(cteyprov: Cteyprov){
    return this.http.put<Cteyprov>(`${environment.SERVER_URL}/Cli`,cteyprov)
          .pipe(map(dataput => {
        return dataput;
      }));
  } 

      //  Consulta de todos los Tipos de Productos
  consRecinto(){
    return this.http.get<any>(`${environment.SERVER_URL}/Recintos/ListaRecintos`, {})
      .pipe(map(listrecintos => {
        if(listrecintos){
        } 
      return listrecintos;
      }));
  } //Cierre del método consRecinto


//  Función: Consulta de los regs de la tabla SYS_CAT_CLI que sean de un tipo en especifico 
//  Componentes que utilizan el servicio:
//             - altafacturas.component.ts
  consTipoCte(tipo){
    let constTipoCli = 'CliTipoCli?'
    let consTipo = 'tipo='
    console.log("consTipoCte")
    console.log("/Cli/"+constTipoCli+consTipo+tipo);
    return this.http.get<any>(`${environment.SERVER_URL}/Cli/`+constTipoCli+consTipo+tipo, {})
      .pipe(map(listTipoCte => {
        if(listTipoCte){
          console.log("Regreso de Tipo de Cliente")
          console.log(listTipoCte)
        } 
        return listTipoCte;
    }));
  } //Cierre del método consTipoCte  
}
