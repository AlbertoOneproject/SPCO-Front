import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Aduanal } from '../model/aduanal';

@Injectable({
  providedIn: 'root'
})
export class AduanalService {
  auth    : String;

  constructor(private http: HttpClient) { }

//  Función: Obtener los registros de la tabla SYS_CAT_AGAD (solo la columna NumPat) 
//  Componentes que utilizan el servicio:
//             - aduanal.component.ts  
listaAduanal(){
  return this.http.get<any>(`${environment.SERVER_URL}/CatAgad/Lista`, {})
    .pipe(map(listAduanal => {
    if(listAduanal){
      console.log("Regreso de la listaAduanal")
      console.log(listAduanal)
    } 
    return listAduanal;
    }));
} //Cierre del método listaAduanal

//  Función: Obtener el registro de la tabla SYS_CAT_AGAD q corresponde a un NumPat especifico 
//  Componentes que utilizan el servicio:
//             - aduanal.component.ts  
aduanalUnico(numPat){
  let constPagLike  = 'ConsAgenteDesc?'  
  let consNumpat    = 'numPat='

  console.log("aduanaUnico")
  console.log("/CatAgad/"+constPagLike+consNumpat+numPat)
  return this.http.get<any>(`${environment.SERVER_URL}/CatAgad/`+constPagLike+consNumpat+numPat, {})
    .pipe(map(listUnico => {
    if(listUnico){
      console.log("Regreso de la aduanalUnico ")
      console.log(listUnico)
    } 
    return listUnico;
    }));
} //Cierre del método aduanaUnico


//  Función: Consulta de todos los regs de la tabla SYS_CAT_AGAD 
//  Componentes que utilizan el servicio:
//             - aduanal.component.ts
llenaAduanal(page, perPage){
  let constPagLike  = 'agAduPag?'
  let constPage     = 'page='
  let constPerPage  = '&perpage='
  this.auth = JSON.parse(localStorage.getItem('autorizacion'));
  console.log("/CatAgad/"+constPagLike+constPage+page+constPerPage+perPage)
  return this.http.get<any>(`${environment.SERVER_URL}/CatAgad/`+constPagLike+constPage+page+constPerPage+perPage, {})
    .pipe(map(listllenaAdu => {
      if(listllenaAdu){
        console.log("regreso de llenaAduanal")
        console.log(listllenaAdu)
         }       
      return listllenaAdu;
    }));      
}    // Cierre del método llenaAduanal

//  Función: Borrar el registro en la tabla SYS_CAT_AGAD 
//  Componentes que utilizan el servicio:
//             - viewaduanal.component.ts  
deleteaduanal(numPat){
  console.log("aduanal.service.ts deleteaduanal")
  console.log(numPat)
  let params = new HttpParams();
  let constPagLike  = 'BorraAgente?'
  let consPat       = 'numPat='
  //params = params.append('id',idCte);
  return this.http.delete<any>(`${environment.SERVER_URL}/CatAgad/`+constPagLike+consPat+numPat, {})
      .pipe(map(datadel => {
    return datadel;

  }));
} 

//  Función: Alta del registro en la tabla SYS_CAT_AGAD 
//  Componentes que utilizan el servicio:
//             - altaaduanal.component.ts  
altaaduanal(aduanal: Aduanal){
  return this.http.post<Aduanal>(`${environment.SERVER_URL}/CatAgad`, aduanal)
      .pipe(map(datapost => {
    return datapost;
    }));
}

//  Función: Modificación del registro en la tabla SYS_CAT_AGAD 
//  Componentes que utilizan el servicio:
//             - editaduanal.component.ts  
editaduanal(aduanal: Aduanal){
  return this.http.put<Aduanal>(`${environment.SERVER_URL}/CatAgad`,aduanal)
        .pipe(map(dataEdit => {
      return dataEdit;
    }));
} 



}
