import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Login, User } from '../model';
import { first } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EdituserComponent } from '../edituser/edituser.component';
import { DeletesysuserComponent } from '../deletesysuser/deletesysuser.component';
import { ChangesyspswComponent } from '../changesyspsw/changesyspsw.component';
import { MatDialog} from '@angular/material/dialog';
import { AlertService, UsersService, RolService } from './../service';
import { AppSecurity } from '../app-security';

@Component({
  selector: 'app-viewsysuser',
  templateUrl: './viewsysuser.component.html',
  styleUrls: ['./viewsysuser.component.css']
})
export class ViewsysuserComponent implements OnInit {
  login: Login;
  perfil: boolean;
  isDisabled: boolean;
  public currentSysUser: User;
  returnUrl: string;
  loading = false;
  msg= '';
  datawork: any=[];
  rolessel= [];
  altausrrol: any =[];
  altausrrolr: any =[];


  public idEmpresa:     string;
  public idRecinto:     string;
  public idUsuario:     string;
  public idPerfil:      string;
  public password:      string;
  public intentos:      string;
  public estatus:       string;
  public fecEst:        string;  
  public userMod:       string;
  public progUser:      string;


  public firsttimeLoginRemaining: boolean;
  public nonexpired: boolean;
  public nonlocked: boolean;
  public nonexpiredCredentials: boolean;
  public enabled: boolean;
  public lastTimePasswordUpdated: Date;
  public passwordNeverExpires: boolean;
  public selfServiceUser: boolean

  constructor(
    private activatedRoute: ActivatedRoute,
    private usersService: UsersService, 
    private rolService: RolService, 
    private security: AppSecurity, 
    private route: ActivatedRoute,
    private router: Router,
//    private modalService: NgbModal,
    private dialog: MatDialog,
    private alertService: AlertService
  ) {
    this.activatedRoute.params.subscribe( params =>{ 
      this.usersService.userid(params['idUsuario'])
      .pipe(first())
      .subscribe(
          data => {
            this.datawork = data;
            if (this.datawork.cr="00"){  
                this.currentSysUser = this.datawork.contenido;
                this.idEmpresa 	    = this.currentSysUser.idEmpresa;
                this.idRecinto      = this.currentSysUser.idRecinto;
                this.idUsuario      = this.currentSysUser.idUsuario;
                this.idPerfil       = this.currentSysUser.idPerfil; 
                this.password       = this.currentSysUser.password; 
                this.intentos       = this.currentSysUser.intentos; 
                this.estatus        = this.currentSysUser.estatus;  
                this.fecEst         = this.currentSysUser.fecEst;   
                this.userMod        = this.currentSysUser.userMod;  
                this.progUser       = this.currentSysUser.progUser 
                this.isDisabled     = false;
                this.consultaSecurity();
            }else{
                this.loading = false;
                this.msg = this.datawork.descripcion;
                this.alertService.error(this.msg);
            }
          },
          error => {
            this.alertService.error("Error en al visualizar el usuario");
            this.loading = false;
          });   
    })
}

ngOnInit(): void {
/*    this.isDisabled = false;
  this.consultaSecurity();
  */
  this.login = JSON.parse(localStorage.getItem('currentUserLog'));
  let perfillogin = this.login["idPerfil"];
  if (perfillogin=="US01"){
      this.perfil=true;      
  }else{
      this.perfil=false;
  }
}

consultaSecurity(){
  let actualizar = this.security.actualizausr();
  if (actualizar){
      if (!this.nonlocked){
        this.isDisabled = true;
      }
  }
} // Cierre del método consultaSecurity


ireditsysuser(idUsuario:string): void {
  console.log("viewsysuser.component.ts ireditsysuser idUsuario");
  console.log(idUsuario);
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/editsysuser';
  this.router.navigate([this.returnUrl,idUsuario]);         
}

deletesysusr(): void {
  const dialogRef = this.dialog.open(DeletesysuserComponent, {
    width: '400px',
    height: '200px',
    data: {idUsuario: this.idUsuario}
  });

  dialogRef.afterClosed().subscribe(result => {
    //this.email = result;
  });
}

changepsw(): void {
  const dialogRef = this.dialog.open(ChangesyspswComponent, {
    width: '450px',
    height: '430px',
    data: {idUsuario: this.idUsuario}
  });

  dialogRef.afterClosed().subscribe(result => {
    //this.email = result;
  });
}  

} // Cierre del metodo principal


