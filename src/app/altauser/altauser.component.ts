import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, UsuarioService, RolService } from './../service';
import { Rol } from '../model/rol'; 
import { Usuario } from '../model/usuario'
import { first, isEmpty } from 'rxjs/operators';
import { analyzeAndValidateNgModules } from '@angular/compiler';

@Component({
  selector: 'app-altauser',
  templateUrl: './altauser.component.html'
})
export class AltauserComponent implements OnInit {
  perfirl:boolean;
  altauserform: FormGroup;
  currentRol: Rol;
  roles= [];
  rolessel: any = [];
  altausrrol: any =[];
  submitted = false;
  msg= '';
  datawork: any=[];
  dataworkrol: any=[];
  disponibles: any;
  selectedLocations: any = [];
  
  loading = false;
  returnUrl: string;
  currentUser: Usuario;
  public altauserrol = { appUserId: ' ', roleId: ' ' };

  constructor(
    private activatedRoutee: ActivatedRoute,
    private fb: FormBuilder,
    private usuarioService: UsuarioService, 
    private rolService: RolService, 
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.submitted = true;
    this.formafb();
    this.consultaRoles();
  } // Cierre del método ngOnInit

  formafb() {
        this.altauserform = this.fb.group({
        'username': new FormControl('', [Validators.required]),
        'firstname': new FormControl('', [Validators.required]),
        'lastname': new FormControl('',[Validators.required]),
        'email': new FormControl('',[Validators.required]),
        'passwordNeverExpires': new FormControl(false),
        'password': new FormControl('',[Validators.required]),
        'repeatPassword': new FormControl('',[Validators.required]),
        'disponibles': new FormControl(''),
        'seleccionados': new FormControl('')
    }); 
  } // Cierre del método formafb

  consultaRoles() {    
    this.rolService.rolcons()
    .pipe(first())
    .subscribe(
        data => {
          console.log("roles")
          console.log(data)
          if (data.cr="00"){
             this.roles = data.roles;
            }else{
              this.loading = false;
              this.msg = data.descripcion;
              this.alertService.error(this.msg);
            }
        },
        error => {
            this.alertService.error(error);
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

  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/usuarios';
    this.router.navigate([this.returnUrl]);   
  }  // Cierre del método cancelar

// convenience getter for easy access to form fields
    get f() { return this.altauserform.controls; }

  enviar() {
/*    
    if (this.altauserform.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
    */

    if (this.f.password.value === this.f.repeatPassword.value) {
        if (this.rolessel.length !== 0) {
        this.currentUser = {
            id: null,
            isDeleted: '0',
            officeId: '1',
            staffId: '0',
            username: this.f.username.value,
            firstname: this.f.firstname.value,
            lastname: this.f.lastname.value, 
            password: this.f.password.value, 
            email: this.f.email.value,
            firsttimeLoginRemaining: false,
            nonexpired: true,
            nonlocked: true,
            nonexpiredCredentials: true,
            enabled: true,
            lastTimePasswordUpdated: new Date(),
            passwordNeverExpires: this.f.passwordNeverExpires.value,
            selfServiceUser: false
            }
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/usuarios';
        this.usuarioService.altauser(this.currentUser)
            .pipe(first())
            .subscribe(
                data => {
                    this.datawork = data;
                    if (this.datawork.cr=="00"){
                      console.log("alta usr regreso")
                      console.log(this.datawork)
                      console.log(this.datawork.contenido.id)
                      for (let i=0; i < this.rolessel.length; i++){
                          this.altauserrol = {
                          appUserId: this.datawork.contenido.id,
                          roleId: this.rolessel[i].id,                        
                        }
                        console.log("roles sel")
                        console.log(this.altauserrol)

                    this.rolService.altausrrol(this.altauserrol)
                        .pipe(first())
                        .subscribe(
                            data1 => {
                              this.dataworkrol = data1;
                              console.log("regreso altausrrol")
                              console.log(this.dataworkrol)
                              if (this.dataworkrol.cr=="00"){
                              }else{
                                this.loading = false;
                                this.msg = this.dataworkrol.descripcion;
                                this.alertService.error(this.msg);
                              }
                            },
                            error => {
                              this.alertService.error("Error en el Alta de Usuario - Roles");
                              this.loading = false;
                            }); 
                    this.router.navigate([this.returnUrl]);
                    this.loading = false;
                    }
                  }
                  else{
                    this.loading = false;
                    this.msg = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                  }
                  },
                error => {
                  this.alertService.error("Error en el Alta de Usuario");
                  this.loading = false;
                }); 
        }  // Cierre del if de la longitud
        else {
            this.alertService.error("Es necesario capturar minimo un Rol");
            this.loading = false;
        }                  
    } // Cierre del if validación del password
      else {
            this.alertService.error("Las contraseñas no coinciden");
            this.loading = false;
        }                  
        return           
    } // Cierre del método enviar
} //Cierre principal