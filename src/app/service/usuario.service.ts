import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Usuario } from '../model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private currentUserSubject: BehaviorSubject<Usuario>;
  public currentUser: Observable<Usuario>;
  usuarios: Usuario;
  auth: String;


  constructor(private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<Usuario>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
 
  public get currentUserValue(): Usuario {
    return this.currentUserSubject.value;
}

//Lista de Usuarios
  usuario(page, perPage, perName ){
    //return this.http.get<any>(`${environment.SERVER_URL}/Users`, {})
      let constPagLike = 'paglike?'
      let consId = '&id='
      let constPag = 'pag?'
      let constPage = 'page='
      let constPerPage = '&perpage='
      this.auth = JSON.parse(localStorage.getItem('autorizacion'));
      //return this.http.get<any>(`${environment.SERVER_URL}/Users/`+constPag+constPage+page+constPerPage+perPage, {})
      return this.http.get<any>(`${environment.SERVER_URL}/Users/`+constPagLike+constPage+page+constPerPage+perPage+consId+perName, {})  
      .pipe(map(listuser => {
        if(listuser){
              console.log("listuser");
              console.log(listuser);
               // store user details and jwt token in local storage to keep user logged in between page refreshes
               localStorage.setItem('currentUser', JSON.stringify(listuser));
               this.currentUserSubject.next(listuser);
           } 
      
        return listuser;

      }));
    
  }


  //Obtiene un usuario en especifico
  usuarioid(username: string){
    let params = new HttpParams();
//    params = params.append('id', username);
    params = params.append('id',username);
    //return this.http.get<any>(`${environment.SERVER_URL}/Users/`, {params:params})
    return this.http.get<Usuario>(`${environment.SERVER_URL}/Users/`+username, {})

    .pipe(map(listuserid => {
        if(listuserid){
           } 
      
        return listuserid;

      }));
  }

  deleteusrid(username: string){
    let params = new HttpParams();
    params = params.append('id',username);
    //return this.http.get<any>(`${environment.SERVER_URL}/Users/`, {params:params})
    return this.http.delete<any>(`${environment.SERVER_URL}/Users/`+username, {})
          .pipe(map(datadel => {
        return datadel;

      }));
  }

  changepsw(username: string, password: string){
  //  changepsw(password: Usuario){
    //this.usuarios.email = 'nuevopas'; 

    //let params = new HttpParams();
    //params = params.append('password',password);
    //return this.http.get<any>(`${environment.SERVER_URL}/Users/`, {password})
    return this.http.put<any>(`${environment.SERVER_URL}/Users/`+username, {password})
          .pipe(map(datadel => {
        return datadel;
      }));
  }

  edituser(edituser: Usuario){
      return this.http.put<Usuario>(`${environment.SERVER_URL}/Users`,edituser)
            .pipe(map(dataput => {
          return dataput;
        }));
  }

  altauser(altauser: Usuario){
      return this.http.post<Usuario>(`${environment.SERVER_URL}/Users`,altauser)
          .pipe(map(datapost => {
    return datapost;
        }));
  }
}


