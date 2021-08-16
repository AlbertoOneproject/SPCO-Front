import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Login, Loginreceive} from '../model';
import { Usuario } from '../model/usuario';

@Injectable({ providedIn: 'root' })
export class LoginService {
  loginrec: Loginreceive;
  error='';
  private currentUserSubject: BehaviorSubject<Login>;
  public currentUser: Observable<Login>;

  constructor(private http: HttpClient) { 
    this.currentUserSubject = new BehaviorSubject<Login>(JSON.parse(localStorage.getItem('currentUserLog')));
    this.currentUser = this.currentUserSubject.asObservable();
  }
 
  public get currentUserValue(): Login {
    return this.currentUserSubject.value;
}


  login(usuario: string, password: string){
/*
    console.log("USUARIO antes: " + usuario)
    console.log("PASS antes: " + password)
    usuario = "mifos";
    password = "password";
    console.log("USUARIO después: " + usuario)
    console.log("PASS después: " + password)

    console.log("serv login: ")
    console.log(usuario);
*/    
    return this.http.post<any>(`${environment.SERVER_URL}/Auth`, { 'user': usuario, 'password': password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (user.authenticated) {
          localStorage.setItem('currentUserLog', JSON.stringify(user));
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('autorizacion', JSON.stringify(user.token));
          this.currentUserSubject.next(user);
        }
        return user;
      },
        error => {
          console.log(error);
        }
      ));
  }
  
  logout() {
    // remove user from local storage to log user out
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }  
}

