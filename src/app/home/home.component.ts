import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Login, } from '../model';
//import { Usuario } from '../model';
import { User } from '../model';
import { LoginService } from '../service';
import { UsersService } from '../service';


@Component({
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  loading = false;
  //usuari: Usuario;
  //usuario: Usuario;
  currentUserLog: Login;
  currentUser: Observable<Login>;
  currentUserSubscription: Subscription;
  users: Login[] = [];

  constructor(
      private router: Router,
      private authenticationService: LoginService,
      private loginService: LoginService,
      private userService: UsersService
  ) {
    
      this.currentUserSubscription = this.authenticationService.currentUser.subscribe(users => {
      this.currentUserLog = users;
      });
      
  }

  ngOnInit() {
      this.loading = true;
//      this.usuari = JSON.parse(localStorage.getItem('currentUserLog'));
//      let username = this.usuari["idUsuario"];
//      console.log("home.component.ts ngOnInit usuari");
//      console.log(this.usuari);
//      console.log(username);
//      this.usuarioService.usuarioid(username).pipe(first()).subscribe(user => {
//      this.userService.user(username).pipe(first()).subscribe(user => {
//      this.usuario = user;
      this.loading = false;
//    });
  }

  ngOnDestroy() {
      // unsubscribe to ensure no memory leaks
      this.currentUserSubscription.unsubscribe();
  }
  
  /*
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
    
}
*/


}
