import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, UsuarioService, RolService } from './../service';
import { Rol } from '../model/rol'; 
import { first } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';


@Component({
  selector: 'app-altarol',
  templateUrl: './altarol.component.html'
})
export class AltarolComponent implements OnInit {
  altarolform: FormGroup;
  loading= false;
  returnUrl: string;
  public currentRol: Rol;
  msg= '';
  datawork: any=[];


  constructor(
    private activatedRoutee: ActivatedRoute,
    private fb: FormBuilder,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private rolService: RolService, 

  ) { }

  ngOnInit(): void {
        this.formafb();
  } // Cierre del metodo ngOnInit

  formafb() {
    this.altarolform = this.fb.group({
      'name': new FormControl('', [Validators.required]),
      'description': new FormControl('', [Validators.required]),
    }); 
  } // Cierre del metodo formafb

  // convenience getter for easy access to form fields
  get f() { return this.altarolform.controls; }


  enviar() {
    if (this.f.name.value > ' ' &&
        this.f.description.value > ' ' ) {
        this.currentRol = {
            id: null,
            name: this.f.name.value,
            description: this.f.description.value,
            disable: false
            }
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/rol';
        this.rolService.altarol(this.currentRol)
            .pipe(first())
            .subscribe(
                data => {
                  this.datawork = data;
                  if (this.datawork.cr="00"){
                    this.router.navigate([this.returnUrl]);
                    this.loading = false;
                  }
                  else{
                    this.loading = false;
                    this.msg = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                  }
                  },
                error => {
                  this.alertService.error("Error en la rutina de alta rol");
                  this.loading = false;
                }); 
    }   
      else {
            this.alertService.error("Los campos con * son obligatorios");
            this.loading = false;
        }                  
        return           
    } // Cierre del método Enviar
} //Cierre Principal
