import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Rol } from '../model/rol';


@Injectable({
  providedIn: 'root'
})
export class RolService {
  private currentRolSubject: BehaviorSubject<Rol>;
  public currentRol: Observable<Rol>;
  rol: Rol;


  constructor(private http: HttpClient) { 
    this.currentRolSubject = new BehaviorSubject<Rol>(JSON.parse(localStorage.getItem('currentRol')));
    this.currentRol = this.currentRolSubject.asObservable();
  }
  public get currentRolValue(): Rol {
    return this.currentRolSubject.value;
  }

  rolconspag(page, perPage, perName){
  //rolconspag(page, perPage){
    let constPagLike = 'paglike?'
    let consId = '&id='
    let constPag = 'pag?'
    let constPage = 'page='
    let constPerPage = '&perpage='
//    return this.http.get<any>(`${environment.SERVER_URL}/Rol/`+constPag+constPage+page+constPerPage+perPage,{})
    return this.http.get<any>(`${environment.SERVER_URL}/Rol/`+constPagLike+constPage+page+constPerPage+perPage+consId+perName, {})  
      .pipe(map(listrol => {
        if(listrol){
                 // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentRol', JSON.stringify(listrol));
            this.currentRolSubject.next(listrol);
             } 
    return listrol;
      }));
  } //Cierre del metodo rolcons

    rolcons(){
    return this.http.get<any>(`${environment.SERVER_URL}/Rol`, {})
      .pipe(map(listrol => {
        if(listrol){
                 // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentRol', JSON.stringify(listrol));
            this.currentRolSubject.next(listrol);
             } 
    return listrol;
      }));
  } //Cierre del metodo rolcons
    
  //Consulta un Rol especifico
  rolconsid(id: string){
    return this.http.get<Rol>(`${environment.SERVER_URL}/Rol/`+id, {})
      .pipe(map(listrolid => {
        if(listrolid){
             } 
    return listrolid;
      }));
  } //Cierre del metodo rolcons

  altarol(altarol: Rol){
    return this.http.post<Rol>(`${environment.SERVER_URL}/Rol`,altarol)
          .pipe(map(datapost => {
    return datapost;
  
        })); 
  } //Cierre del metodo altarol

  //--> Método para actualiza el estado del Rol
  updaterol(updaterol){
    return this.http.put<Rol>(`${environment.SERVER_URL}/Rol`,updaterol)
          .pipe(map(dataput => {
    return dataput;
         })); 
  } //Cierre del metodo updaterol

    //--> Método para borrar un registro
  deleterol(idRol: string){
    console.log(idRol);
    return this.http.delete<Rol>(`${environment.SERVER_URL}/Rol/`+idRol)
          .pipe(map(datadel => {
          console.log(datadel)
    return datadel;
           })); 
  } //Cierre del metodo deleterol
  

  altausrrol(altausrrol){
    return this.http.post<Rol>(`${environment.SERVER_URL}/UserRol`,altausrrol)
          .pipe(map(datapost => {
    return datapost;
        })); 
  } //Cierre del metodo altarol

  
  consuserrol(iduser: string){
    return this.http.get<any>(`${environment.SERVER_URL}/UserRol/`+iduser, {})
      .pipe(map(listrol => {
        if(listrol){
         // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentRol', JSON.stringify(listrol));
            this.currentRolSubject.next(listrol);
             } 
    return listrol;
      }));
  } //Cierre del metodo consuserrol

  deluserrol(iduser: string){
    return this.http.delete<any>(`${environment.SERVER_URL}/UserRol/`+iduser, {})
      .pipe(map(delrol => {
        if(delrol){
         // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentRol', JSON.stringify(delrol));
            this.currentRolSubject.next(delrol);
             } 
    return delrol;
      }));
  } //Cierre del metodo consuserrol
  
}
