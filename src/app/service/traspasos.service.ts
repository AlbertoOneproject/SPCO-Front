import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Traspasos } from '../model/traspasos';

@Injectable({
  providedIn: 'root'
})
export class TraspasosService {
  auth    : String;  

  constructor(private http: HttpClient) { }

//  Función: Alta del registro en la tabla SYS_ADU_TRASP
//  Componentes que utilizan el servicio:
//             - altatraspasos.component.ts  
altaTraspaso(traspaso: Traspasos){
  return this.http.post<Traspasos>(`${environment.SERVER_URL}/AduTrasp`,traspaso)
      .pipe(map(dataTras => {
    return dataTras;
    }));
}

//  Función: Visualizar un registro especifico de la tabla SYS_ADU_TRASP
//  Componentes que utilizan el servicio:
//             - viewtraspasos.component.ts  
viewTraspaso(idCte, parte, factura, pedimento ){
  console.log("Entre al servicio Consulta de traspaso")
  console.log(idCte)
  console.log(parte)
  console.log(factura)
  console.log(pedimento)
  let consViewTr      = "TraspUnico?";
  let constCte        = "cliente=";
  let constPart       = "&parte=";
  let constFact       = "&factura=";
  let constPedi       = "&pedimento=";

  return this.http.get<any>(`${environment.SERVER_URL}/AduTrasp/`+consViewTr+constCte+idCte+constPart+parte+constFact+factura+constPedi+pedimento, {})
  .pipe(map(listTraspCte => {
    if(listTraspCte){
      console.log("regreso de View Traspaso ")
      console.log(listTraspCte)
       }       
    return listTraspCte;
  }));      
}    // Cierre del método viewTraspaso


//  Función: Borrar el registro en la tabla SYS_ADU_TRASP 
//  Componentes que utilizan el servicio:
//             - viewtraspasos.component.ts  
deletetraspasos(idCliProv:string, numPart: string, numFact: string, numPedi: string){  
  let consDelete      = "TraspBorrar?";
  let constCte        = "cliente=";
  let constPart       = "&parte=";
  let constFact       = "&factura=";
  let constPedi       = "&pedimento=";

  return this.http.delete<Traspasos>(`${environment.SERVER_URL}/AduTrasp/`+consDelete+constCte+idCliProv+constPart+numPart+constFact+numFact+constPedi+numPedi,{})
      .pipe(map(datadel => {
        console.log("regrese del delete traspaso con   ")
        console.log(datadel)
    return datadel;
  })); 
}  

//  Función: Visualizar un registro específico con descripción de producto de la tabla SYS_ADU_TRASP
//  Componentes que utilizan el servicio:
//             - edittraspasos.component.ts  
viewTraspasoDesc(idCte, parte, factura, pedimento ){
  console.log("Entre al servicio Consulta de traspaso")
  console.log(idCte)
  console.log(parte)
  console.log(factura)
  console.log(pedimento)
  let consViewTr      = "TraspUnicoDesc?";
  let constCte        = "cliente=";
  let constPart       = "&parte=";
  let constFact       = "&factura=";
  let constPedi       = "&pedimento=";

  return this.http.get<any>(`${environment.SERVER_URL}/AduTrasp/`+consViewTr+constCte+idCte+constPart+parte+constFact+factura+constPedi+pedimento, {})
  .pipe(map(listTraspCte => {
    if(listTraspCte){
      console.log("regreso de View Traspaso ")
      console.log(listTraspCte)
       }       
    return listTraspCte;
  }));      
}    // Cierre del método viewTraspaso

//  Función: Obtener todas las partes de un cliente sobre la tabla SYS_ADU_TRASP
//  Componentes que utilizan el servicio:
//             - edittraspasos.component.ts  
viewPartesCteTrasp(idCte){
  console.log("Entre al servicio Consulta de traspaso")
  console.log(idCte)
  let consViewTr      = "FactCliUNI?";
  let constCte        = "cliente=";

  return this.http.get<any>(`${environment.SERVER_URL}/AduTrasp/`+consViewTr+constCte+idCte, {})
  .pipe(map(listPartesCteTrasp => {
    if(listPartesCteTrasp){
      console.log("regreso de View Partes Cte Traspaso ")
      console.log(listPartesCteTrasp)
       }       
    return listPartesCteTrasp;
  }));      
}    // Cierre del método viewPartesCteTrasp

//  Función: Obtener todas las facturas de un cliente sobre la tabla SYS_ADU_TRASP
//  Componentes que utilizan el servicio:
//             - edittraspasos.component.ts  
viewFactCteTrasp(idCte){
  console.log("Entre al servicio Consulta de traspaso")
  console.log(idCte)
  let consViewTr      = "FactCliFUNI?";
  let constCte        = "cliente=";

  return this.http.get<any>(`${environment.SERVER_URL}/AduTrasp/`+consViewTr+constCte+idCte, {})
  .pipe(map(listFactCteTrasp => {
    if(listFactCteTrasp){
      console.log("regreso de View Facturas Cte Traspaso ")
      console.log(listFactCteTrasp)
       }       
    return listFactCteTrasp;
  }));      
}    // Cierre del método viewFactCteTrasp

}

