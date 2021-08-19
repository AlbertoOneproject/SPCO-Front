import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { LoginService, SysdtaplService } from './service';
import { Login, Sysdtapl } from './model';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  dynamicForm: FormGroup;
  currentUser: Login;
  apesel: any = [];
  apl: Sysdtapl;
  dataapl: any=[];


  constructor(
      private router: Router,
      private formBuilder: FormBuilder,
      private authenticationService: LoginService,
      private consapl: SysdtaplService
  ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.consultaDatosApl();
    this.dynamicForm = this.formBuilder.group({
        listaallapl: ['', Validators.required],
        tickets: new FormArray([])
    });
}

/*
  consultaRoles() {    
    this.rolService.rolcons()
    .pipe(first())
    .subscribe(
        data => {
            if (data.cr="00"){
                this.roles = data.roles;
                for (let i=0; i < this.roles.length; i++){
                    for (let j=0; j < this.altausrrol.length; j++){
                        if (this.altausrrol[j].roleId === this.roles[i].id) {
                            this.rolessel.push(this.roles[i]);
                            this.roles.splice(i, 1);
                        }   }  }
            }else{
                this.loading = false;
                this.msg = this.datawork.descripcion;
                this.alertService.error(this.msg);
            }   },
        error => {
            this.alertService.error("Error en la consulta de roles");
            this.loading = false;
        });
  } // Cierre del método consultaroles
  */

  
  consultaDatosApl(){
    this.consapl.aplcons()
    .pipe(first())
    .subscribe(
        data => {
//          if (data.cr="00"){          
            this.dataapl = data;
            console.log ("app.component.ts/consultaDatosApl  dataapl ")
            console.log(this.dataapl)
            console.log(this.dataapl.cr)
            this.apl = this.dataapl.contenido;
            console.log(this.dataapl.contenido)          
            console.log(this.apl)          
            console.log(this.apl[1].clvap)
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
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }
}
