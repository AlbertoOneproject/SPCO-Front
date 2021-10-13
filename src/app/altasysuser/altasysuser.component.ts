import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, UsersService, RolService } from './../service';
import { User } from '../model/user'
import { first } from 'rxjs/operators';
import { MsgokComponent } from './../msgok/msgok.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-altasysuser',
  templateUrl: './altasysuser.component.html',
  styleUrls: ['./altasysuser.component.css']
})
export class AltasysuserComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);

  altasysuserform: FormGroup;
  usuari = User;
  submitted = false;
  msg= '';
  datawork: any=[];
  dataworkrol: any=[];
  disponibles: any;
  selectedLocations: any = [];
  currString: string;

  progUser='SYSALTAS';
  userMod = '24210010';
  
  
  loading = false;
  returnUrl: string;
  currentSysUser: User;
  public altauserrol = { appUserId: ' ', roleId: ' ' };

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private activatedRoutee: ActivatedRoute,
    private fb: FormBuilder,
    private usersService: UsersService, 
    private rolService: RolService, 
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.submitted = true;
    this.formafb();
    //this.usuari = JSON.parse(localStorage.getItem('currentUserLog'));
    //let userMod = this.usuari["idUsuario"];
  } // Cierre del método ngOnInit

  formafb() {
        this.altasysuserform = this.fb.group({
          'idEmpresa': new FormControl('',[Validators.required]),
          'idRecinto': new FormControl('',[Validators.required]),
          'idUsuario': new FormControl('',[Validators.required]),
          'idPerfil':  new FormControl('',[Validators.required]),
          'password':  new FormControl('',[Validators.required]),
          'repeatPassword':  new FormControl('',[Validators.required]),
          'intentos':  new FormControl('',[Validators.required]),
          'estatus':   new FormControl('',[Validators.required])
    }); 
  } // Cierre del método formafb


  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/users';
    this.router.navigate([this.returnUrl]);   
  }  // Cierre del método cancelar

// convenience getter for easy access to form fields
    get f() { return this.altasysuserform.controls; }

  enviar() {
    
    if (this.altasysuserform.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }


    if (this.f.password.value === this.f.repeatPassword.value) {
        this.armausuario();
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/user';
        this.usersService.altasysuser(this.currentSysUser)
            .pipe(first())
            .subscribe(
                data => {
                    this.datawork = data;
                    if (data.cr=="00"){
                      this.msgok();
                  }
                error => {
                  this.alertService.error("Error en el Alta de Usuario");
                  this.loading = false;
                }
              }); 
        } // Cierre del if validación del password
          else {
              this.alertService.error("Las contraseñas no coinciden");
              this.loading = false;
        }                  
        return           
    } // Cierre del método enviar

    
  armausuario(){
      this.currentSysUser = {
          idEmpresa: this.f.idEmpresa.value,
          idRecinto: this.f.idRecinto.value,
          idUsuario: this.f.idUsuario.value,
          idPerfil:  this.f.idPerfil.value,  
          password:  this.f.password.value,  
          intentos:  this.f.intentos.value,  
          estatus:   this.f.estatus.value,  
          fecEst:    this.curr,  
          userMod:   this.userMod, 
          progUser:  this.progUser,  
      }        
  }     // Cierre del metodo armausuario

  msgok(): void {
    const dialogRef = this.dialog.open(MsgokComponent, {
      width: '400px',
      height: '200px',
      //data: {idUsuario: this.idUsuario}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }


} //Cierre principal
