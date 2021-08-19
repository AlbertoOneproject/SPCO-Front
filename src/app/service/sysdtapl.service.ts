import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Sysdtapl } from '../model/sysdtapl';

@Injectable({
  providedIn: 'root'
})
export class SysdtaplService {
  sysdtapl: Sysdtapl;

  constructor(private http: HttpClient) { 
}


  //Consulta de todos los regs de la APL
  aplcons(){
    return this.http.get<Sysdtapl>(`${environment.SERVER_URL}/CatApendices`, {})
      .pipe(map(listapl => {
        if(listapl){
          this.sysdtapl = listapl;
          console.log("sysdtapl.service.ts/aplcons  Apl");
          console.log(listapl);
             } 
    return this.sysdtapl;
      }));
  } //Cierre del metodo aplcons
}
