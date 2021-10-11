import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';
import { Facturas } from '../model/facturas';

@Injectable({
  providedIn: 'root'
})
export class FacturasService {
  auth    : String;

  constructor(private http: HttpClient) { }


//  Función: Consulta de todos los regs de la tabla SYS_ADU_PART
//  Componentes que utilizan el servicio:
//             - facturas.component.ts
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


//  Función: Consulta de todos los regs de la tabla SYS_ADU_PART que pertenecen a un cliente, numero de parte
//  Componentes que utilizan el servicio:
//             - facturas.component.ts
FacturasCte(idCte, numParte, page, perPage, perName ){
  let constPagLike  = 'aduFactCliPagBet?'
  let constPage     = 'page='
  let constPerPage  = '&perpage='
  let consCliente   = '&cliente='
  let consParte     = '&parte='
  this.auth = JSON.parse(localStorage.getItem('autorizacion'));
  console.log("factura.service FacturaCte parámetro")
  console.log("/AduFact/"+constPagLike+constPage+page+constPerPage+perPage+consCliente+idCte+consParte+numParte)
  return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+constPagLike+constPage+page+constPerPage+perPage+consCliente+idCte+consParte+numParte, {})
    .pipe(map(listFactCte => {
      if(listFactCte){
        console.log("regreso de Facturas Cte")
        console.log(listFactCte)
         }       
      return listFactCte;
    }));      
}    // Cierre del método PartesCte

//  Función: Consulta el registro único de la tabla SYS_ADU_FACT que pertenecen a un cliente/parte/factura
//  Componentes que utilizan el servicio:
//             - viewfactura.component.ts
facturaUnica(idCte, parte, factura ){
      let constPagLike  = 'FactCliPartFact?'
      let consCliente   = 'cliente='
      let consParte     = '&parte='
      let consFactura   = '&factura='  
      this.auth = JSON.parse(localStorage.getItem('autorizacion'));
      return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+constPagLike+consCliente+idCte+consParte+parte+consFactura+factura, {})
        .pipe(map(listCteParFac => {
          if(listCteParFac){
            console.log("regreso de facturaUnica")
            console.log(listCteParFac)
             }       
          return listCteParFac;
        }));      
    }    // Cierre del método partesUnico


//  Función: Borrar el registro en la tabla SYS_ADU_FACT 
//  Componentes que utilizan el servicio:
//             - viewfacturas.component.ts  
deletefactura(idCte, parte, fact){
  let params = new HttpParams();
  let constPagLike  = 'FactCliPartFact?'
  let consCliente   = 'cliente='
  let consParte     = '&parte='
  let consFact      = '&factura='  

  params = params.append('id',idCte);
  return this.http.delete<any>(`${environment.SERVER_URL}/AduFact/`+constPagLike+consCliente+idCte+consParte+parte+consFact+fact, {})
      .pipe(map(datadel => {
    return datadel;

  }));
}    



//  Función: Alta del registro en la tabla SYS_ADU_FAC 
//  Componentes que utilizan el servicio:
//             - altafacturas.component.ts  
altafacturas(facturas: Facturas){
  return this.http.post<Facturas>(`${environment.SERVER_URL}/AduFact`,facturas)
      .pipe(map(datapost => {
    return datapost;
    }));
}

}
