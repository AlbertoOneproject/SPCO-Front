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

  altaape(altaape: Sysdtape){
    return this.http.post<Sysdtape>(`${environment.SERVER_URL}/DetCatAp`,altaape)
        .pipe(map(datapost => {
  return datapost;
      }));
}

  apeconscve(clvap: string){
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

  //apeconscveidid(cveapidid: string){
    apeconscveidid(cveap: string, id1:string, id2:string){   
    let params = new HttpParams();
//    params = params.append('id', username);
    params = params.append('id',cveap);
    //return this.http.get<any>(`${environment.SERVER_URL}/Users/`, {params:params})
    return this.http.get<Sysdtape>(`${environment.SERVER_URL}/DetCatAp/Unico/`+cveap +'?id1=' + id1 + '&id2=' + id2, {})
    .pipe(map(listape => {
        if(listape){
           } 
        return listape;

      }));
  }

  //Consulta una clave especifica 
    apeconscves(cve, page, perPage, perName){
      this.cve = 'AP08';
//    return this.http.get<Sysdtape>(`${environment.SERVER_URL}/DetCatAp/`+cve, {})
      return this.http.get<Sysdtape>(`${environment.SERVER_URL}/DetCatAp/`+this.cve,{})
      .pipe(map(listapecve => {
        if(listapecve){
          this.sysdtape = listapecve;
             } 
    return listapecve;
      }));
  }       //apeconscve

  deleteapeid(cveap: string, id1:string, id2:string){
    let params = new HttpParams();
    params = params.append('id',cveap);
    //return this.http.get<any>(`${environment.SERVER_URL}/Users/`, {params:params})
    return this.http.delete<any>(`${environment.SERVER_URL}/DetCatAp/`+cveap +'?id1=' + id1 + '&id2=' + id2, {})
          .pipe(map(datadel => {
        return datadel;

      }));
  }      //deleteapeid

  editape(editape: Sysdtape){
    return this.http.put<Sysdtape>(`${environment.SERVER_URL}/DetCatAp`,editape)
          .pipe(map(dataput => {
        return dataput;
      }));
}


}         //export