import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Rol } from '../model/rol';
import { RolPerm } from '../model/rolperm';
import { Permisos } from '../model/permisos';
import { first } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EdituserComponent } from '../edituser/edituser.component';
import { EnablerolComponent } from '../enablerol/enablerol.component';
import { DisablerolComponent } from '../disablerol/disablerol.component';
import { DeleterolComponent } from '../deleterol/deleterol.component';
import { ChangepswComponent } from '../changepsw/changepsw.component';
import { MatDialog} from '@angular/material/dialog';
import { AlertService, PermisosService, RolService, RolpermService} from './../service';
import { BoundDirectivePropertyAst } from '@angular/compiler';

@Component({
  selector: 'app-viewrol',
  templateUrl: './viewrol.component.html',
  styles: [
  ]
})

export class ViewrolComponent implements OnInit {
  dataperm: any[];
  viewrolform: FormGroup;
  form: FormGroup;
  currentRol: Rol;
  myProperty = false;
  currentRolPerm: any =[];
  currentRolPermalta: any =[];
  currentRolPermdel: any =[];
  currentRolPermEnviar: RolPerm;
  inigrouping = {}; 
  loading = false;
  msg= '';
  datawork: any=[];
  cb: boolean;
  editar: boolean;
  encontrado: boolean;
  isRoleEnable: boolean;
  isEditar: boolean;
  returnUrl: string;

  //variables 
  permisos = [];
  public backperm = [];
  groupings: {} []=[];
  temp: Permisos;
  formData = {};
  checkboxesChanged = false; // this flag is informing backup-system if user started editing
  bValuesOnly = []; // array for 1-0 values only from permission-checkboxes
  tempPermissionUIData = [];
  isDisabled: boolean;
  currentGrouping = "";
  private enc_rolperm: boolean;
  private id: string;
  private name: string
  private description: string;
  private disable: boolean;
  private roleId: string;
  private permissionid: string

  constructor(
    private activatedRoute: ActivatedRoute,
    private permisosService: PermisosService, 
    private rolService: RolService, 
    private rolpermService: RolpermService, 
    private alertService: AlertService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) { 
     this.activatedRoute.params.subscribe( params =>{ 
      this.rolService.rolconsid(params['id'])
      .pipe(first())
      .subscribe(
          data => {
              this.datawork = data;
              if (this.datawork.cr=="00"){
                this.currentRol = this.datawork.roles;
                this.id = this.currentRol.id; 
                this.name = this.currentRol.name;
                this.description = this.currentRol.description;
                this.disable = this.currentRol.disable
                if (this.disable) {
                  this.isRoleEnable = true;
                 } else {
                  this.isRoleEnable = false;
                 }
                }else{
                  this.loading = false;
                  this.msg = this.datawork.descripcion;
                  this.alertService.error(this.msg);
                }
              },
          error => {
              this.alertService.error("Error en el proceso de visualizar el rol");
              this.loading = false;
          });   
    })
  }

  ngOnInit(): void {
    this.editar = false;
    this.isEditar = false;
    this.isDisabled = true;
    this.formafb();
    this.consultaRolPerm(this.id);  
    this.consultaPermisos();
  }

       // convenience getter for easy access to form fields
       get f() { return this.viewrolform.controls; }

  formafb() {
    this.form = this.fb.group({
        code: this.fb.array([])
      });
    this.viewrolform = this.fb.group({
        'cb': new FormControl(' ', [Validators.required]),
    });    
    this.form = this.fb.group({
        'cb': new FormControl(' '),
    });    
  } // Cierre del método formafb

  consultaRolPerm(id: string){
    console.log("rolperm id ..... ")
    console.log(this.id)
    this.enc_rolperm = false;
    this.activatedRoute.params.subscribe( params =>{ 
        this.rolpermService.rolpermconsid(params['id'])
        .pipe(first())
        .subscribe(
            data => {
              this.datawork = data;
              console.log("rolperm ..... ")
              console.log(data)
              if (this.datawork.cr=="00"){
                //this.currentRolPerm.push(data);
                this.currentRolPerm = this.datawork.contenido;
                console.log(this.currentRolPerm)
                this.enc_rolperm = true;
              }else{
                this.loading = false;
                this.msg = this.datawork.descripcion;
                this.alertService.error(this.msg);
              }  
            },
            error => {
                this.alertService.error("Error en proceso de consultar Rol-Permisos");
                this.loading = false;
            });   
      })
  } // Cierre del método consultaRolPerm

  consultaPermisos() {  
    this.permisosService.conspermisos()
    .pipe(first())
    .subscribe(
        data => {
          this.datawork = data;
          if (this.datawork.cr=="00"){
            console.log("consulta permperm  ..... ")
            console.log(this.datawork)
        
            this.dataperm = this.datawork.contenido;
            this.temp = this.datawork.contenido;
            for (let j=0; j < this.dataperm.length; j++){  
            this.groupings = [
              {
                id: this.dataperm[j].id,
                grouping: this.dataperm[j].grouping,
                code: this.dataperm[j].code,
                entity_name: this.dataperm[j].entity_name,
                action_name: this.dataperm[j].action_name,
                can_maker_checker: this.dataperm[j].can_maker_checker,
                isChecked: false
              }]
            }
          }else{
            this.loading = false;
            this.msg = this.datawork.descripcion;
            this.alertService.error(this.msg);
          }
        },
        error => {
          this.alertService.error("Error en la consulta de permisos");              
          this.loading = false;
        });
  } // Cierre del método consultaPermisos

  disablerol(): void {
    const dialogRef = this.dialog.open(DisablerolComponent, {
      width: '400px',
      height: '200px',
      data: {currentrol: this.currentRol}
    });

    dialogRef.afterClosed().subscribe(result => {
        this.isRoleEnable = true;
     // this.email = result;
    });
  }

  enablerol(): void {
    const dialogRef = this.dialog.open(EnablerolComponent, {
      width: '400px',
      height: '200px',
      data: {currentrol: this.currentRol}
    });

    dialogRef.afterClosed().subscribe(result => {
        this.isRoleEnable = false;
    });
  }

  deleterol(): void {
    const dialogRef = this.dialog.open(DeleterolComponent, {
      width: '400px',
      height: '200px',
      data: {id: this.currentRol.id}
    });

    dialogRef.afterClosed().subscribe(result => {
        this.isRoleEnable = false;
    });
  }

  showPermisos(grouping) {
    this.isEditar = true;
    this.permisos = [];
    for (let i=0; i < grouping.value.length; i++){
        this.permisos.push(grouping.value[i]);
        if (this.enc_rolperm) {
            this.permisos[i].isChecked = false;
            for (let j=0; j < this.currentRolPerm.length; j++){  
              if (grouping.value[i].id == this.currentRolPerm[j].permissionId){
                  this.permisos[i].isChecked = true;
                  this.backperm.push(this.permisos[i].id);
              }
            }
        } else {
        }
    }
  }

  onCheckBoxChanges(id: string, isChecked: boolean) {
      for (let i=0; i<this.permisos.length; i++){
          if (this.permisos[i].id == id){
              if (this.permisos[i].isChecked==false){
                 this.permisos[i].isChecked = true;
              }else{
                this.permisos[i].isChecked = false;
              }
          };
      }
  }

editRoles() {
    this.isDisabled = false;
}

selectAll(allSelected){
    if(allSelected == false){
       for (let i=0; i < this.permisos.length; i++){
           this.permisos[i].isChecked = true;
       }
    }else{
        for (let i=0; i < this.permisos.length; i++){
            this.permisos[i].isChecked = false;
        }
    }
} //Cierre del método selectAll

enviar() {
    for (let i=0; i < this.permisos.length; i++){
        if (this.permisos[i].isChecked == true) {
            this.encontrado = false;
            for (let j=0; j < this.currentRolPerm.length; j++){  
                if (this.permisos[i].id == this.currentRolPerm[j].permissionId){
                    this.encontrado = true;
                }
            }
            if (!this.encontrado){
                this.rolpermalta(this.currentRol.id,this.permisos[i].id)
                this.encontrado = false;
                this.backperm.push(this.permisos[i].id);
            }
        } else {
            this.encontrado = false;
            for (let j=0; j < this.currentRolPerm.length; j++){  
                if (this.permisos[i].id == this.currentRolPerm[j].permissionId){
                    this.encontrado = true;
                }
            }
            if (this.encontrado){
                this.rolpermdel(this.currentRol.id,this.permisos[i].id)
                this.encontrado = false;
                this.backperm.splice(i, 1);
            }
        }
        this.consultaRolPerm(this.id);  
    }
    this.isDisabled = true;        
} //Cierre del método enviar

rolpermalta(idRol: string, idPerm: string){
    this.currentRolPermEnviar = {
        roleId: idRol,
        permissionId: idPerm
        }
    this.loading = true;
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewrol/';
 
    this.rolpermService.rolpermalta(this.currentRolPermEnviar)
        .pipe(first())
        .subscribe(
            data => {
              this.datawork = data;
              if (this.datawork.cr=="00"){
                //this.currentRolPerm.push(data);
                this.currentRolPermalta = data;
                this.enc_rolperm = true;
              }else{
                this.loading = false;
                this.msg = this.datawork.descripcion;
                this.alertService.error(this.msg);
              }
            },
            error => {
                this.alertService.error("Error en la rutina de alta de permisos");              
                this.loading = false;
            });   

  } // Cierre del método rolpermalta

  rolpermdel(idRol: string, idPerm: string){
    console.log("delete rol...")
    console.log(idRol)
    console.log(idPerm)
    this.loading = true;
    this.rolpermService.rolpermdel(idRol, idPerm)
        .pipe(first())
        .subscribe(
            data => {
              this.datawork = data;
              if (this.datawork.cr=="00"){
                  this.currentRolPermdel = data;
                  this.enc_rolperm = true;
              }else{
                this.loading = false;
                this.msg = this.datawork.descripcion;
                this.alertService.error(this.msg);  
              }    
            },
            error => {
              this.alertService.error("Error al borrar Rol-Permiso");
              this.loading = false;
            });   

  } // Cierre del método rolpermdel

cancel() {
    for (let i=0; i < this.permisos.length; i++){
            this.permisos[i].isChecked = false;
            for (let j=0; j < this.currentRolPerm.length; j++){  
              if (this.permisos[i].id == this.backperm[j]){
                  this.permisos[i].isChecked = true;
              }
            }
        }
   this.isDisabled = true;
} //Cierre del método cancel

} //Cierre del método principal
