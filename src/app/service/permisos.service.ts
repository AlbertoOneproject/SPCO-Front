import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Permisos } from '../model/permisos';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private currentPermisosSubject: BehaviorSubject<Permisos>;
  public currentPermisos: Observable<Permisos>;
  permisos: Permisos;


  
  constructor(private http: HttpClient) { 
    this.currentPermisosSubject = new BehaviorSubject<Permisos>(JSON.parse(localStorage.getItem('currentPermisos')));
    this.currentPermisos = this.currentPermisosSubject.asObservable();
  }
  public get currentPermisosValue(): Permisos {
    return this.currentPermisosSubject.value;
  }


  UserRol
  conspermisos(){
    return this.http.get<any>(`${environment.SERVER_URL}/Permisos`, {})
      .pipe(map(listrol => {
        if(listrol){
                 // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentRol', JSON.stringify(listrol));
            this.currentPermisosSubject.next(listrol);
             } 
    return listrol;
      }));
  } //Cierre del metodo rolcons
}
