import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, UsuarioService, RolService } from './../service';
import { first } from 'rxjs/operators';
import { Usuario } from './../model'
import { Rol } from '../model/rol'; 
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html'
})
export class EdituserComponent implements OnInit {
  currentUser: Usuario;
  loading = false;
  returnUrl: string;
  edituserform: FormGroup;
  roles= [];
  rolessel: any = [];
  altausrrol: any =[];

  disponibles: any;
  selectedLocations: any = [];
  altauserrol = { appUserId: ' ', roleId: ' ' };

  msg= '';
  datawork: any=[];
  dataworkrol: any=[];

  public id: string;
  public isDeleted: string
  public officeId: string;
  public staffId: string
  public username: string;
  public firstname: string;
  public lastname: string;
  public password: string;
  public email: string;
  public firsttimeLoginRemaining: boolean;
  public nonexpired: boolean;
  public nonlocked: boolean;
  public nonexpiredCredentials: boolean;
  public enabled: boolean;
  public lastTimePasswordUpdated: Date;
  public passwordNeverExpires: boolean;
  public selfServiceUser: boolean

  constructor(
    private activatedRoutee: ActivatedRoute,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private usuarioService: UsuarioService, 
    private rolService: RolService, 
  ) { 
  }
   
  ngOnInit(): void {
    this.formafb();
    this.consultaUsuario();
  }

  formafb() {
    this.edituserform = this.fb.group({
        'username': new FormControl('', [Validators.required]),
        'firstname': new FormControl('', [Validators.required]),
        'lastname': new FormControl('',[Validators.required]),
        'email': new FormControl('',[Validators.required]),
        'passwordNeverExpires': new FormControl(''),
        'disponibles': new FormControl(''),
        'seleccionados': new FormControl('')
    });    
  } // Cierre del método formafb

  consultaUsuario(){
    this.activatedRoutee.params.subscribe( params =>{ 
        this.usuarioService.usuarioid(params['username'])
        .pipe(first())
        .subscribe( 
            data => {
                this.datawork = data;
                if (this.datawork.cr=="00"){
                    this.currentUser = this.datawork.contenido;
                    this.edituserform.controls['username'].setValue(this.currentUser.username);
                    this.edituserform.controls['firstname'].setValue(this.currentUser.firstname);
                    this.edituserform.controls['lastname'].setValue(this.currentUser.lastname);
                    this.edituserform.controls['email'].setValue(this.currentUser.email);
                    this.edituserform.controls['passwordNeverExpires'].setValue(this.currentUser.passwordNeverExpires);
                    this.id = this.currentUser.id; 
                    this.isDeleted = this.currentUser.isDeleted;
                    this.officeId = this.currentUser.officeId;
                    this.staffId = this.currentUser.staffId;
                    this.username = this.currentUser.username;
                    this.password = this.currentUser.password; 
                    this.firsttimeLoginRemaining = this.currentUser.firsttimeLoginRemaining;
                    this.nonexpired = this.currentUser.nonexpired;
                    this.nonlocked = this.currentUser.nonlocked;
                    this.nonexpiredCredentials = this.currentUser.nonexpiredCredentials;
                    this.enabled = this.currentUser.enabled;
                    this.lastTimePasswordUpdated = this.currentUser.lastTimePasswordUpdated;
                    this.selfServiceUser =this.currentUser.selfServiceUser
                    this.consultaUserRoles();
                }else{
                    this.loading = false;
                    this.msg = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                }
            },
            error => {
                this.alertService.error("Error al momento de editar el usuario");
                this.loading = false;
            });   
        })
  }
   
  consultaUserRoles() {  
    this.rolService.consuserrol(this.id)
    .pipe(first())
    .subscribe(
        data => {
            this.dataworkrol = data;
            if (this.dataworkrol.cr=="00"){
                this.altausrrol = data.contenido;
                this.consultaRoles();
            }else{
              this.loading = false;
              this.msg = this.dataworkrol.descripcion;
              this.alertService.error(this.msg);
            }
        },
        error => {
            this.alertService.error("Error al momento de consultar el rol por usuario");
            this.loading = false;
        });
  } // Cierre del método consultaroles
  
  consultaRoles() {    
    this.rolService.rolcons()
    .pipe(first())
    .subscribe(
        data => {
            if (data.cr=="00"){
                this.roles = data.roles;
                for (let i=0; i < this.roles.length; i++){
                    for (let j=0; j < this.altausrrol.length; j++){
                        if (this.altausrrol[j].roleId === this.roles[i].id) {
                            this.rolessel.push(this.roles[i]);
                            this.roles.splice(i, 1);
                        }
                    }
                }
            }else{
                this.loading = false;
                this.msg = this.datawork.descripcion;
                this.alertService.error(this.msg);
            }
        },
        error => {
            this.alertService.error("Error en la consulta de roles");
            this.loading = false;
        });
   
  } // Cierre del método consultaroles

  addRole(index) {
    this.rolessel.push(this.roles[index]);
    this.roles.splice(index, 1);
  } // Cierre del método addRole
  
  removeRole(index) {
    this.roles.push(this.rolessel[index]);
    this.rolessel.splice(index, 1);
  } // Cierre del método reoveRole

      // convenience getter for easy access to form fields
    get f() { return this.edituserform.controls; }

  enviar() {
    console.log("edit usr enviar")
    if (this.edituserform.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
    console.log("edit usr enviar")
    console.log(this.rolessel.length)
    if (this.rolessel.length !== 0) {
        this.armausuario();
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/usuarios';
        this.delusrrol();
        this.usuarioService.edituser(this.currentUser)
          .pipe(first())
          .subscribe(
              data => {
                this.dataworkrol = data;
                if (this.dataworkrol.cr=="00"){
                    console.log("edit rol usr regreso")
                    console.log(this.datawork)
                    console.log(this.datawork.contenido.id)                    
                    for (let i=0; i < this.rolessel.length; i++){
                    this.altauserrol = {
                        appUserId: this.dataworkrol.contenido.id,
                        roleId: this.rolessel[i].id
                    }
                    console.log("roles sel")
                    console.log(this.altauserrol)
//jasg 13/08/2021
                this.rolService.altausrrol(this.altauserrol)
                    .pipe(first())
                    .subscribe(
                        data1 => {
                        },
                        error => {
                            this.loading = false;
                        }); 
                this.router.navigate([this.returnUrl]);
                this.loading = false;
                }
                }else{
                    this.loading = false;
                    this.msg = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                }
              },
              error => {
                this.alertService.error("Error al enviar el usuario");
                this.loading = false;
              });    
            }  // Cierre del if de la longitud
            else {
                this.alertService.error("Es necesario capturar minimo un Rol");
                this.loading = false;
            }                  
    
  } // Cierre del metodo enviar

  armausuario(){
    this.currentUser = {
        id: this.id,
        isDeleted:  this.isDeleted,
        officeId: this.officeId,
        staffId: this.staffId,
        username: this.f.username.value,
        firstname: this.f.firstname.value,
        lastname: this.f.lastname.value, 
        password: this.password, 
        email: this.f.email.value,
        firsttimeLoginRemaining: this.firsttimeLoginRemaining,
        nonexpired: this.nonexpired,
        nonlocked: this.nonlocked,
        nonexpiredCredentials: this.nonexpiredCredentials,
        enabled: this.enabled,
        lastTimePasswordUpdated: this.lastTimePasswordUpdated,
        passwordNeverExpires: this.f.passwordNeverExpires.value,
        selfServiceUser: this.selfServiceUser
        }
  } // Cierre del metodo armausuario

  delusrrol(){
    this.rolService.deluserrol(this.id)
    .pipe(first())
    .subscribe(
        data => {
        }, 
        error => {
        });                  
  } // Cierre del metodo delusrrol

  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewuser';
    this.router.navigate([this.returnUrl,this.username]);   

  } // Cierre del metodo cancelar
  
}








/*
(function (module) {
    mifosX.controllers = _.extend(module, {
        EditUserController: function (scope, routeParams, resourceFactory, location) {

            scope.formData = {};
            scope.offices = [];
            scope.available = [];
            scope.selected = [];
            scope.selectedRoles = [] ;
            scope.availableRoles = [];

            scope.user = [];
            scope.formData.roles = [] ;

            resourceFactory.userListResource.get({userId: routeParams.id, template: 'true'}, function (data) {
                scope.formData.username = data.username;
                scope.formData.firstname = data.firstname;
                scope.formData.lastname = data.lastname;
                scope.formData.email = data.email;
                scope.formData.officeId = data.officeId;
                scope.getOfficeStaff();
                if(data.staff){
                    scope.formData.staffId = data.staff.id;
                }
                scope.selectedRoles=data.selectedRoles;
                scope.availableRoles = data.availableRoles ;


                scope.userId = data.id;
                scope.offices = data.allowedOffices;
                //scope.availableRoles = data.availableRoles.concat(data.selectedRoles);
                scope.formData.passwordNeverExpires = data.passwordNeverExpires;
            });
            scope.getOfficeStaff = function(){
                resourceFactory.employeeResource.getAllEmployees({officeId:scope.formData.officeId},function (staffs) {
                    scope.staffs = staffs;
                });
            };

            scope.addRole = function () {
                for (var i in this.available) {
                    for (var j in scope.availableRoles) {
                        if (scope.availableRoles[j].id == this.available[i]) {
                            var temp = {};
                            temp.id = this.available[i];
                            temp.name = scope.availableRoles[j].name;
                            scope.selectedRoles.push(temp);
                            scope.availableRoles.splice(j, 1);
                        }
                    }
                }
                //We need to remove selected items outside of above loop. If we don't remove, we can see empty item appearing
                //If we remove available items in above loop, all items will not be moved to selectedRoles
                for (var i in this.available) {
                    for (var j in scope.selectedRoles) {
                        if (scope.selectedRoles[j].id == this.available[i]) {
                            scope.available.splice(i, 1);
                        }
                    }
                }
            };
            scope.removeRole = function () {
                for (var i in this.selected) {
                    for (var j in scope.selectedRoles) {
                        if (scope.selectedRoles[j].id == this.selected[i]) {
                            var temp = {};
                            temp.id = this.selected[i];
                            temp.name = scope.selectedRoles[j].name;
                            scope.availableRoles.push(temp);
                            scope.selectedRoles.splice(j, 1);
                        }
                    }
                }
                //We need to remove selected items outside of above loop. If we don't remove, we can see empty item appearing
                //If we remove selected items in above loop, all items will not be moved to availableRoles
                for (var i in this.selected) {
                    for (var j in scope.availableRoles) {
                        if (scope.availableRoles[j].id == this.selected[i]) {
                            scope.selected.splice(i, 1);
                        }
                    }
                }
            };

            scope.submit = function () {
                for (var i in scope.selectedRoles) {
                    scope.formData.roles.push(scope.selectedRoles[i].id) ;
                }
                resourceFactory.userListResource.update({'userId': scope.userId}, this.formData, function (data) {
                    location.path('/viewuser/' + data.resourceId);
                });
            };
        }
    });
    mifosX.ng.application.controller('EditUserController', ['$scope', '$routeParams', 'ResourceFactory', '$location', mifosX.controllers.EditUserController]).run(function ($log) {
        $log.info("EditUserController initialized");
    });
}(mifosX.controllers || {}));


*/


