import { Component, OnInit,  Inject, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, UsersService } from './../service';
import { first } from 'rxjs/operators';
import { User } from './../model'
import { formatDate } from '@angular/common';
import { MsgokComponent } from './../msgok/msgok.component'
import { MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-editsysuser',
  templateUrl: './editsysuser.component.html',
  styleUrls: ['./editsysuser.component.css']
})
export class EditsysuserComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  progUser='SYSALTAS';
  userMod = '24210010';

  currentSysUser: User;
  loading = false;
  returnUrl: string;
  editsysuserform: FormGroup;
  altausrrol: any =[];

  disponibles: any;
  selectedLocations: any = [];
  altauserrol = { appUserId: ' ', roleId: ' ' };

  msg= '';
  datawork: any=[];
  dataworkedit: any=[];

  public idEmpresa:     string;
  public idRecinto:     string;
  public idUsuario:     string;
  public idPerfil:      string;
  public password:      string;
  public intentos:      string;
  public estatus:       string;
  public fecEst:        string;  
  

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private activatedRoutee: ActivatedRoute,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private usersService: UsersService, 
    private dialog: MatDialog,
  ) { 
  }
   
  ngOnInit(): void {
    this.formafb();
    this.consultaSysUser();
  }

  formafb() {
    this.editsysuserform = this.fb.group({
        'idEmpresa': new FormControl('',[Validators.required]),
        'idRecinto': new FormControl('',[Validators.required]),
        'idUsuario': new FormControl('',[Validators.required]),
        'idPerfil':  new FormControl('',[Validators.required]),
        'intentos':  new FormControl('',[Validators.required]),
        'estatus':   new FormControl('',[Validators.required]),
        'fecEst':    new FormControl('',[Validators.required]),
        'userMod':   new FormControl('',[Validators.required]),
        'progUser':  new FormControl('',[Validators.required])
    });    
  }     // Cierre del método formafb

  consultaSysUser(){
    this.activatedRoutee.params.subscribe( params =>{ 
        this.usersService.userid(params['idUsuario'])
        .pipe(first())
        .subscribe( 
            data => {
                this.datawork = data;
                if (this.datawork.cr="00"){
                    this.currentSysUser = this.datawork.contenido;
                    this.editsysuserform.controls['idEmpresa'].setValue(this.currentSysUser.idEmpresa);
                    this.editsysuserform.controls['idRecinto'].setValue(this.currentSysUser.idRecinto);
                    this.editsysuserform.controls['idUsuario'].setValue(this.currentSysUser.idUsuario);
                    this.editsysuserform.controls['idPerfil'].setValue(this.currentSysUser.idPerfil);
                    this.editsysuserform.controls['intentos'].setValue(this.currentSysUser.intentos);
                    this.editsysuserform.controls['estatus'].setValue(this.currentSysUser.estatus);
                    this.editsysuserform.controls['fecEst'].setValue(this.currentSysUser.fecEst);
                    this.editsysuserform.controls['userMod'].setValue(this.currentSysUser.userMod);
                    this.editsysuserform.controls['progUser'].setValue(this.currentSysUser.progUser);
                    this.idEmpresa	   = this.currentSysUser.idEmpresa;    
                    this.idRecinto     = this.currentSysUser.idRecinto;    
                    this.idUsuario     = this.currentSysUser.idUsuario;    
                    this.idPerfil      = this.currentSysUser.idPerfil;     
                    this.password      = this.currentSysUser.password;     
                    this.intentos      = this.currentSysUser.intentos;     
                    this.estatus       = this.currentSysUser.estatus;      
                    this.fecEst        = this.currentSysUser.fecEst;       
                    this.userMod       = this.currentSysUser.userMod;      
                    this.progUser      = this.currentSysUser.progUser      
                }else{
                    this.loading = false;
                    this.msg     = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                }
            },
            error => {
                this.alertService.error("Error al momento de editar el usuario");
                this.loading = false;
            });   
        })
  }     // Cierre del método consultaSysUser
   
// convenience getter for easy access to form fields
    get f() { return this.editsysuserform.controls; }

  enviar() {
    console.log("editsysuser enviar")
    if (this.editsysuserform.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
    console.log("editsysuser enviar 1")
        this.armausuario();
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewsysuser';
        console.log("editsysuser.component enviar currentSysUser");
        console.log(this.currentSysUser);
        this.usersService.editsysuser(this.currentSysUser)
          .pipe(first())
          .subscribe(
              data => {
                this.dataworkedit = data;
                if (this.dataworkedit.cr=="00"){
                    console.log("edit rol usr regreso")
                    console.log(this.datawork)
                    console.log(this.datawork.contenido.id)
                    this.msgok();                    
                }
              },
              error => {
                this.alertService.error("Error al enviar el usuario");
                this.loading = false;
              });    
             
    
  } //     Cierre del metodo enviar

  armausuario(){
    this.currentSysUser = {
        idEmpresa: this.idEmpresa,  
        idRecinto: this.idRecinto,  
        idUsuario: this.idUsuario,  
        idPerfil:  this.f.idPerfil.value,  
        password:  this.password,
        intentos:  this.f.intentos.value,  
        estatus:   this.f.estatus.value,  
        fecEst:    this.curr,  
        userMod:   this.userMod, 
        progUser:  this.progUser
    }        
  }     // Cierre del metodo armausuario

  cancelar(idUsuario: string): void {
    console.log("editsysuser cancelar idUsuario");
    console.log(idUsuario);
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewsysuser';
    this.router.navigate([this.returnUrl,idUsuario]);   
  }     // Cierre del metodo cancelar
  
  msgok(): void {
    const dialogRef = this.dialog.open(MsgokComponent, {
      width: '400px',
      height: '200px',
      //data: {idUsuario: this.idUsuario}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }    // Cierre del método msgok
}

