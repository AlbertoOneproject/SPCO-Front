import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { first } from 'rxjs/operators';
import { LoginService, SysdtaplService } from './service';
import { Login, Sysdtapl, Rol } from './model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  dynamicForm: FormGroup;
  currentUser: Login;
  currentRol: Rol;
  currentUserLog: Login;
  apesel: any = [];
  apl: Sysdtapl;
  dataapl: any=[];
  


  constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private authenticationService: LoginService,
      private consapl: SysdtaplService
  ) {
//    this.currentUser = null;
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      this.authenticationService.currentUser.subscribe(x => this.currentUserLog = x);
  }

  ngOnInit() {
//    this.currentUser = null;
    this.consultaDatosApl();
    this.dynamicForm = this.formBuilder.group({
        listaallapl: ['', Validators.required],
        tickets: new FormArray([])
    });
  }

  invocaApe(value: any){
    let navigationExtras: NavigationExtras = {
      queryParams: {
          "clvap": value.clvap,
          "desCorta": value.desCorta
      }
    }
   
//    this.router.routeReuseStrategy.shouldReuseRoute = function () {
//     return false;
//    }
//    this.router.onSameUrlNavigation = 'reload';

//    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
//    this.router.onSameUrlNavigation = 'reload';

    this.router.navigate(['/ape'], navigationExtras).then (() => window.location.reload ());
    //this.router.navigate(['/ape'], navigationExtras);
  };

  consultaDatosApl(){
    this.consapl.aplcons()
    .pipe(first())
    .subscribe(
        data => {
//          if (data.cr=="00"){          
            this.dataapl = data;
            this.apl = this.dataapl.contenido;
        },
        error => {
//          this.alertService.error("Error en la consulta de permisos");              
//          this.loading = false;
        });
  } // Cierre del método consultadatos

  ConsApe(i: string){
      console.log("ConsApe");
      console.log(i);

  }

  logout() {
      this.currentUser = null;
      this.currentRol = null;
      this.currentUserLog = null;
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }
}
