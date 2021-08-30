import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertService, UsersService } from './../service';
import { first } from 'rxjs/operators';
import { Login, User } from './../model'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  login: Login;
  perfil: boolean;
  usersForm: FormGroup;
  page: number;
  perPage: number;
  perName: string;
  total: number;
  totalPages: number;
  currentUser: User;
  loading = false;
  msg= '';
  returnUrl: string;

  constructor(
    private usersService: UsersService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,

  ) {
    this.page = 1;
    this.perPage = 6;
    this.perName = "";
   }

  ngOnInit(): void {
    this.usersForm = this.formBuilder.group({
      'nombre':new FormControl('', [Validators.required]),
      'items': new FormControl('', [Validators.required])
  });
      this.consultaUsers(this.page, this.perPage, this.perName);

      this.login = JSON.parse(localStorage.getItem('currentUserLog'));
      let perfillogin = this.login["idPerfil"];
      if (perfillogin=="US01"){
          this.perfil=true;      
      }else{
          this.perfil=false;
      }
  }

// convenience getter for easy access to form fields
get f() { return this.usersForm.controls; }

consultaUsers(page: number, perPage: number, perName: string)  {    
  this.usersService.user(page,perPage,perName)
  .pipe(first())
  .subscribe(
      data => {
        if (data.cr=="00"){
            console.log("user.component.ts consultaUser data")
            console.log(data)
            this.currentUser = data.contenido.sysUsuarios;
            console.log(this.currentUser)
            this.page = data.contenido.page;
            this.perPage = data.contenido.perPage;
            this.total = data.contenido.total;
            this.totalPages = data.contenido.totalPages;
        }else{
            this.loading = false;
            this.msg = data.descripcion;
            this.alertService.error(this.msg);
      }
    },
      error => {
          this.alertService.error("No hay conexión con la Base de Datos");
          this.loading = false;
      });
}

altausr(): void {
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/altasysuser';
  this.router.navigate([this.returnUrl]);         
}

routeTo(idUsuario:string): void {
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewsysuser';
  this.router.navigate([this.returnUrl,idUsuario]);   
}

buscar(){
  this.perName = ""
  if (this.f.items.value > 0) {
    this.perPage =  this.f.items.value
  }
  if (this.f.nombre.value != "") {
    this.perName =  this.f.nombre.value
  }
  this.consultaUsers(this.page, this.perPage, this.perName); 
}

mudouPagina(evento) {
  this.perName = ""
  if (this.f.items.value > 0) {
    this.perPage =  this.f.items.value
  }
  if (this.f.nombre.value != "") {
    this.perName =  this.f.nombre.value
  }
  this.consultaUsers(evento.valor, this.perPage, this.perName); 
}
}
