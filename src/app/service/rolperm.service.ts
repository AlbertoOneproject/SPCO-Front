import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RolPerm } from '../model/rolperm';
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class RolpermService {
  private currentRolPermSubject: BehaviorSubject<RolPerm>;
  public currentRolPerm: Observable<RolPerm>;
  rolperm: RolPerm;


  constructor(private http: HttpClient) { 
    this.currentRolPermSubject = new BehaviorSubject<RolPerm>(JSON.parse(localStorage.getItem('currentRolPerm')));
    this.currentRolPerm = this.currentRolPermSubject.asObservable();
  }
  public get currentRolPermValue(): RolPerm {
    return this.currentRolPermSubject.value;
  }
    //Consulta permisos de un Rol especifico
    rolpermconsid(id: string){
      return this.http.get<RolPerm>(`${environment.SERVER_URL}/RolPerm/`+id, {})
        .pipe(map(listrolid => {
          if(listrolid){
               } 
      return listrolid;
        }));
    } //Cierre del metodo rolpermconsid

    rolpermalta(altarolperm: RolPerm){
      return this.http.post<RolPerm>(`${environment.SERVER_URL}/RolPerm`,altarolperm)
        .pipe(map(listrolpost => {
          if(listrolpost){
               } 
      return listrolpost;
        }));
    } //Cierre del metodo rolpermalta

    rolpermdel(idRol: string, idPerm: string){
      return this.http.delete<RolPerm>(`${environment.SERVER_URL}/RolPerm/`+idRol +'/' +idPerm, {})
        .pipe(map(listrolpost => {
          if(listrolpost){
               } 
      return listrolpost;
        }));
    } //Cierre del metodo rolpermdel

}