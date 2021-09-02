import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from './../model'
import { first } from 'rxjs/operators';

import { AlertService, UsuarioService } from './../service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html'
})

export class UsuarioComponent implements OnInit {
  usuarioForm: FormGroup;
  loading = false;
  msg= '';
  submitted = false;
  returnUrl: string;
  currentUser: Usuario;

  page: number;
  perPage: number;
  perName: string;
  total: number;
  totalPages: number;

  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
  ) { 
    this.page = 1;
    this.perPage = 6;
    this.perName = "";
  }

  ngOnInit(): void {
    this.usuarioForm = this.formBuilder.group({
      'nombre':new FormControl('', [Validators.required]),
      'items': new FormControl('', [Validators.required])
  });
      this.consultaUsuarios(this.page, this.perPage, this.perName);
  }

// convenience getter for easy access to form fields
get f() { return this.usuarioForm.controls; }

  consultaUsuarios(page: number, perPage: number, perName: string)  {    
    this.usuarioService.usuario(page,perPage,perName)
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){
            this.currentUser = data.contenido.users;
//            this.router.navigate([this.returnUrl]);
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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/altauser';
    this.router.navigate([this.returnUrl]);         
  }

  routeTo(username:string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewuser';
    this.router.navigate([this.returnUrl,username]);   
  }

  buscar(){
    this.perName = ""
    if (this.f.items.value > 0) {
      this.perPage =  this.f.items.value
    }
    if (this.f.nombre.value != "") {
      this.perName =  this.f.nombre.value
    }
    console.log(this.page)
    console.log(this.perPage)
    console.log(this.perName)
    this.consultaUsuarios(this.page, this.perPage, this.perName); 
  }

  mudouPagina(evento) {
    this.perName = ""
    if (this.f.items.value > 0) {
      this.perPage =  this.f.items.value
    }
    if (this.f.nombre.value != "") {
      this.perName =  this.f.nombre.value
    }
    this.consultaUsuarios(evento.valor, this.perPage, this.perName); 
  }
}