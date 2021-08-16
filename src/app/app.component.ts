import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoginService } from './service';
import { Login } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser: Login;

  constructor(
      private router: Router,
      private authenticationService: LoginService
  ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  logout() {
      this.currentUser = null;
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }
}
