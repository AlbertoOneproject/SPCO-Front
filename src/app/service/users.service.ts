import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  users: User;
  auth: String;

  constructor(private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

  }
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  //Lista de Usuarios
  user(page, perPage, perRecinto ){
    //return this.http.get<any>(`${environment.SERVER_URL}/Users`, {})
      let constPagLike = 'RecintPag?'
      let consRecinto = '&recinto='
      let constPag = 'pag?'
      let constPage = 'page='
      let constPerPage = '&perpage='
      this.auth = JSON.parse(localStorage.getItem('autorizacion'));
      //return this.http.get<any>(`${environment.SERVER_URL}/Users/`+constPag+constPage+page+constPerPage+perPage, {})
      return this.http.get<any>(`${environment.SERVER_URL}/SysUser/`+constPagLike+constPage+page+constPerPage+perPage+consRecinto+perRecinto, {})
      .pipe(map(listuser => {
        if(listuser){
          // store user details and jwt token in local storage to keep user logged in between page refreshes
               localStorage.setItem('currentUser', JSON.stringify(listuser));
               this.currentUserSubject.next(listuser);
           } 
      
        return listuser;

      }));
    
  }
    //Obtiene un usuario en especifico
    userid(idUsuario: string){
      let constLike = 'SysUs?sysUser='
      let params = new HttpParams();
      params = params.append('id',idUsuario);
      return this.http.get<User>(`${environment.SERVER_URL}/SysUser/`+constLike+idUsuario, {})
      .pipe(map(listuserid => {
          if(listuserid){
             } 
        
          return listuserid;
  
        }));
    }


    deletesysusrid(idUsuario: string){
      let params = new HttpParams();
      params = params.append('id',idUsuario);
      return this.http.delete<any>(`${environment.SERVER_URL}/SysUser/`+idUsuario, {})
            .pipe(map(datadel => {
          return datadel;
  
        }));
    }
    editsysuser(edituser: User){
      return this.http.put<User>(`${environment.SERVER_URL}/SysUser`,edituser)
            .pipe(map(dataput => {
          return dataput;
        }));
    }  
    
    altasysuser(altauser: User){
    return this.http.post<any>(`${environment.SERVER_URL}/SysUser`,altauser)
        .pipe(map(datapost => {
    return datapost;
      }));
    }
    
    changesyspsw(idUsuario: string, password: string){
      let constPass = 'Pass'
      //  changepsw(password: Usuario){
        //this.usuarios.email = 'nuevopas'; 
    
        //let params = new HttpParams();
        //params = params.append('password',password);
        //return this.http.get<any>(`${environment.SERVER_URL}/Users/`, {password})
        return this.http.put<any>(`${environment.SERVER_URL}/SysUser/`+constPass, { 'user': idUsuario, 'password': password })
              .pipe(map(datadel => {
            return datadel;
          }));
      }

}
