import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Sysdtape } from '../model/sysdtape';

@Injectable({
  providedIn: 'root'
})
export class SysdtapeService {
  sysdtape: Sysdtape;
  cve: string;

  constructor(private http: HttpClient) { 

  }

  apeconscve(clvap: string){
    clvap = 'AP08';
    console.log("sysdtape.service.ts/apeconscve param ")
    console.log(clvap)
    let params = new HttpParams();
//    params = params.append('id', username);
    params = params.append('id',clvap);
    //return this.http.get<any>(`${environment.SERVER_URL}/Users/`, {params:params})
    return this.http.get<Sysdtape>(`${environment.SERVER_URL}/DetCatAp/`+clvap, {})

    .pipe(map(listape => {
        if(listape){
           } 
      
        return listape;

      }));
  }

  apeconscveidid(cveapidid: string){
    console.log("sysdtape.service.ts/apeconscveidid    param ")
    console.log(cveapidid);

    let params = new HttpParams();
//    params = params.append('id', username);
    params = params.append('id',cveapidid);
    //return this.http.get<any>(`${environment.SERVER_URL}/Users/`, {params:params})
    return this.http.get<Sysdtape>(`${environment.SERVER_URL}/DetCatAp/`+cveapidid, {})

    .pipe(map(listape => {
        if(listape){
           } 
      
        return listape;

      }));
  }

  //Consulta una clave especifica 
  //apeconscve(cve: string){
    apeconscves(cve, page, perPage, perName){
      this.cve = 'AP08';
//    return this.http.get<Sysdtape>(`${environment.SERVER_URL}/DetCatAp/`+cve, {})
      return this.http.get<Sysdtape>(`${environment.SERVER_URL}/DetCatAp/`+this.cve,{})
      .pipe(map(listapecve => {
        if(listapecve){
          this.sysdtape = listapecve;
          console.log("Ape");
          console.log(listapecve);
          console.log(this.sysdtape);
             } 
    return listapecve;
      }));
  }       //apeconscve
}         //export