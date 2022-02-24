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
  return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+constPagLike+constPage+page+constPerPage+perPage+consCliente+idCte+consParte+numParte, {})
    .pipe(map(listFactCte => {
      if(listFactCte){
        console.log("regreso de Facturas Cte")
        console.log(listFactCte)
         }       
      return listFactCte;
    }));      
}    // Cierre del método PartesCte


//  Función: Consulta de todos los regs de la tabla SYS_ADU_PART que pertenecen a un cliente, numero de parte
//  Componentes que utilizan el servicio:
//             - facturas.component.ts
FacturasCte2(idCte, numParte, page, perPage, perName ){
  let constPagLike  = 'aduFactCliPagBet2?'
  let constPage     = 'page='
  let constPerPage  = '&perpage='
  let consCliente   = '&cliente='
  let consParte     = '&parte='
  this.auth = JSON.parse(localStorage.getItem('autorizacion'));
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
//             - editfacturasal.component.ts  
altafacturas(facturas: Facturas){
  return this.http.post<Facturas>(`${environment.SERVER_URL}/AduFact`,facturas)
      .pipe(map(datapost => {
    return datapost;
    }));
}

//  Función: Modifica el registro en la tabla SYS_ADU_PART 
//  Componentes que utilizan el servicio:
//             - editpartes.component.ts  
editfactura(facturas: Facturas){
  return this.http.put<Facturas>(`${environment.SERVER_URL}/AduFact`,facturas)
      .pipe(map(dataput => {
    return dataput;
  }));
}  

//  Función: Consulta el numero total de existencia sobre un Cliente/Producto SYS_ADU_PART 
//  Componentes que utilizan el servicio:
//             - altafacturasal.component.ts  
obtenExistencia(idCliu:string, prod:string, parm:string ){
  console.log("obten Existencia parametros")
  console.log(idCliu)
  console.log(prod)
  let consCuantos  =  "Cuantos?"
  let consCli      =  "cli="
  let consPro      =  "&prod="
  let consParm     =  "&parm="
  return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+consCuantos+consCli+idCliu+consPro+prod+consParm+parm, {})
      .pipe(map(dataExist => {
        console.log("Regreso de obten Existencia ")
        console.log(dataExist)
    return dataExist;
  }));
}  

//  Función: Consulta el numero total de existencia sobre un Cliente/Producto SYS_ADU_PART 
//  Componentes que utilizan el servicio:
//             - editfacturasal.component.ts  
obtenExistenciaInv(idCliu:string, prod:string, parm:string){
  console.log("obten Existencia parametros Inv")
  console.log(idCliu)
  console.log(prod)
  let consCuantos  =  "CuantosInvTot?"
  let consCli      =  "cli="
  let consPro      =  "&prod="
  let consParm     =  "&parm="
  return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+consCuantos+consCli+idCliu+consPro+prod+consParm+parm, {})
      .pipe(map(dataExist => {
        console.log("De regreso de parametros INV")
        console.log(dataExist)
    return dataExist;
  }));
}  


//  Función: Consulta el numero total de existencia sobre un Cliente/Producto SYS_ADU_PART considerando las facturas 
//  Componentes que utilizan el servicio:
//             - altatraspasos.component.ts  
obtenExistenciaReal(idCliu:string, prod:string, parm:string){
  console.log("obten Existencia Real parametros Inv")
  console.log(idCliu)
  console.log(prod)
  let consCuantos  =  "Cuantos?"
  let consCli      =  "cli="
  let consPro      =  "&prod="
  let consParm     =  "&parm="
  return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+consCuantos+consCli+idCliu+consPro+prod+consParm+parm, {})
      .pipe(map(dataExist => {
        console.log("De regreso de parametros Real ")
        console.log(dataExist)
    return dataExist;
  }));
}  




//  Función: Consulta los registros de la tabla de Traspasos  sobre un Cliente SYS_ADU_TRANS con paginación
//  Componentes que utilizan el servicio:
//             - traspasos.component.ts
obtenTraspasosCte(idCli, page, perPage){
  console.log("obten Traspasos Cliente ")
  let consTrasp    =  "TraspasosPag?"
  let consCli      =  "cli="
  let constPage     = '&page='
  let constPerPage  = '&perpage='

  return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+consTrasp+consCli+idCli+constPage+page+constPerPage+perPage, {})
      .pipe(map(dataTraspCte => {
        console.log("De regreso de parametros Traspasos ")
        console.log(dataTraspCte)
    return dataTraspCte;
  }));
}  

//  Función: Borrar los registros de la tabla de Facturas sobre un Cliente y producto  SYS_ADU_FACT 
//  Componentes que utilizan el servicio:
//             - editfacturalsal.component.ts
borrarFacturas(idCli, prod, factSal){
  console.log("borrar Facturas Service")
  console.log(idCli)
  console.log(prod)
  console.log(factSal)
  let consDelete   =  "FactCliProdFact?"
  let consCli      =  "cliente="
  let constProd    = '&producto='
  let constFact    = '&factura='

  return this.http.delete<any>(`${environment.SERVER_URL}/AduFact/`+consDelete+consCli+idCli+constProd+prod+constFact+factSal, {})
      .pipe(map(dataDelete => {
        console.log("De regreso de borrar Facturas Service")
        console.log(dataDelete)
    return dataDelete;
  }));
}  

//  Función: Realiza el traspaso de facturas a otro recinto, sobre un Cliente SYS_ADU_TRANS 
//  Componentes que utilizan el servicio:
//             - editfacturasal.component.ts  
realizaTraspaso(idCliO:string, prod:string, cant:string, recintoD:string, idCliD:string, numFact:string ){
  console.log("obten realiza Traspaso ")
  console.log(idCliO)
  console.log(prod)
  console.log(cant)
  console.log(recintoD)
  console.log(idCliD)
  console.log(numFact)

  let consTrasp    =  "Traspaso?"
  let consCli      =  "cli="
  let consPro      =  "&prod="
  let consCant     =  "&cantidad="
  let consRecD     =  "&recintoD="
  let consCliD     =  "&cliD="
  let consnumFac   =  "&numFactN="
  return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+consTrasp+consCli+idCliO+consPro+prod+consCant+cant+consRecD+recintoD+consCliD+idCliD+consnumFac+numFact, {})
      .pipe(map(dataTrasp => {
        console.log("De regreso realiza traspaso")
        console.log(dataTrasp)
    return dataTrasp;
  }));
} 


//  Función: Realiza la consulta de las facturas de retiro que pertencen a un cliente, sobre un Cliente SYS_ADU_FACT 
//  Componentes que utilizan el servicio:
//             - altatraspasos.component.ts  
consFactRetiro(idCli:string){
  console.log("obten facturas Traspasos ")
  console.log(idCli)
  let consFact     =  "FactCliFUNI?"
  let consCli      =  "cliente="

  return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+consFact+consCli+idCli, {})
      .pipe(map(dataFact => {
        console.log("De regreso consulta facturas FUNI ")
        console.log(dataFact)
    return dataFact;
  }));
} 

//  Función: Realiza la consulta de las partes de retiro que pertencen a un cliente, sobre un Cliente SYS_ADU_FACT 
//  Componentes que utilizan el servicio:
//             - altatraspasos.component.ts  
consPartRetiro(idCli:string){
  console.log("obten facturas Traspasos ")
  console.log(idCli)
  let consFact     =  "FactCliUNI?"
  let consCli      =  "cliente="

  return this.http.get<any>(`${environment.SERVER_URL}/AduFact/`+consFact+consCli+idCli, {})
      .pipe(map(dataPart => {
        console.log("De regreso consulta partes UNI ")
        console.log(dataPart)
    return dataPart;
  }));
} 

}
