import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Rol } from './../model'
import { first } from 'rxjs/operators';

import { AlertService, RolService } from './../service';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styles: [
  ]
})
export class RolComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  currentRol: Rol;
  estado: string;
  msg= '';

  page: number;
  perPage: number;
  perName: string;

  total: number;
  totalPages: number;

  constructor(
    private rolService: RolService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {
    console.log("estoy en Constructor")
    this.page = 1;
    this.perPage = 10;
    this.perName = "";
   }

  ngOnInit(): void {
    console.log("estoy en OnInit")
    this.consultaRol(this.page, this.perPage, this.perName);
  }

  consultaRol(page: number, perPage: number, perName: string) { 
    console.log("estoy en consultaRol ")   
    this.rolService.rolconspag(page,perPage,perName)
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){
            console.log("Roles...")
            console.log(data)
            this.currentRol = data.contenido.roles;
//            this.router.navigate([this.returnUrl]);
            this.page = data.page;
            this.perPage = data.perPage;
            this.total = data.total;
            this.totalPages = data.totalPages;
          }else{
            this.loading = false;
            this.msg = data.descripcion;
            this.alertService.error(this.msg);
          }
        },
        error => {
          this.msg = "No hay conexión con la Base de Datos";
          this.alertService.error(this.msg);
          this.loading = false;
        });
  }

  altarol(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/altarol';
    this.router.navigate([this.returnUrl]);         
  }

  routeTo(id:string): void {
    console.log("routeTo rol")
    console.log(id)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewrol';
    this.router.navigate([this.returnUrl,id]);   
  }

  mudouPagina(evento) {
  this.perName = ""
  this.perPage = 10
  /*
  if (this.f.items.value > 0) {
    this.perPage =  this.f.items.value
  }
  if (this.f.nombre.value != "") {
    this.perName =  this.f.nombre.value
  }
  */
  this.consultaRol(evento.valor, this.perPage, this.perName); 
  }
}

