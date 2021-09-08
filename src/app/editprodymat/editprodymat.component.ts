import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, ProdymatService,SysdtapeService } from './../service';
import { Prodymat, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokpmComponent } from './../msgokpm/msgokpm.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { of } from 'rxjs';

interface Tipo {
  Tipo: string;
  desc: string;
}



@Component({
  selector: 'app-editprodymat',
  templateUrl: './editprodymat.component.html',
  styleUrls: ['./editprodymat.component.css']
})
export class EditprodymatComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1 = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  progUserc ='ALTAPROD';
  material: boolean=false;
  usuario: string;
  empresaa: string;
  recintoo: string;
  apl: Sysdtape;
  editprodymat: FormGroup;
  usuari: Login
  currentProdymat: Prodymat;
  loading = false;
  returnUrl: string;
  editsysuserform: FormGroup;
  altausrrol: any =[];
  orders = [];
  clvap: string;
  
  disponibles: any;
  selectedLocations: any = [];
  altauserrol = { appUserId: ' ', roleId: ' ' };
  msg= '';
  datawork: any=[];
  dataworkedit: any=[];
  
  public clveProduc:    string;  
  public tipProd:       string;  
  public indVis:        string;  
  public descCorta:     string;  
  public descLarga:     string;  
  public descCorIng:    string;  
  public descLarIng:    string;  
  public uM:            string;  
  public empresa:       string;  
  public recinto:       string;  
  public fechaAlta:     string;  
  public fechaMod:      string;  
  public hora:          string;  
  public userMod:       string;  
  public tip_Mat:       string;  
  
  prod: Tipo[] = [
    {Tipo: '6', desc: 'Productos'},
    {Tipo: '7', desc: 'Materiales'},
    {Tipo: '8', desc: 'Activo Fijo'}
  ];

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private consape: SysdtapeService,
    private prodymatService: ProdymatService,
    private activatedRoutee: ActivatedRoute,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private dialog: MatDialog,
  ) { 
// mimic async orders
    this.orders = this.getOrders();
  }
     
  ngOnInit(): void {
    this.consultaDatosApl();
    this.formafb();
    this.consultaDatosProdymat();    
    this.usuari = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario = this.usuari["idUsuario"];
    let empresa = this.usuari["idEmpresa"];
    let recinto = this.usuari["idRecinto"];
    this.usuario = usuario;
    this.empresa = empresa;
    this.recinto = recinto;
  }

  getOrders() {
    return [
      { id: "S", name: "SI" },
      { id: "N", name: "NO" }
    ];
  }

  cambio(tp: any){
    if (tp.target.value == '7'){
        this.material = true;
    }else{
       this.material = false;
       this.editprodymat.controls['tip_Mat'].setValue("");
    }
   }
  
  formafb() {
    this.editprodymat = this.fb.group({
      'clveProduc':  new FormControl('',[Validators.required]),
      'tipProd':     new FormControl('',[Validators.required]),
     'gender':       new FormControl('',[Validators.required]),
      'orders':      new FormControl('',[Validators.required]),
      'descCorta':   new FormControl('',[Validators.required]),
      'descLarga':   new FormControl('',[Validators.required]),
      'descCorIng':  new FormControl('',[Validators.required]),
      'descLarIng':  new FormControl('',[Validators.required]),
      'listaallapl': new FormControl('',[Validators.required]),
      'fechaAlta':   new FormControl('',[Validators.required]),
      'fechaMod':    new FormControl('',[Validators.required]),
      'hora':        new FormControl('',[Validators.required]),      
      'userMod':     new FormControl('',[Validators.required]),
      'tip_Mat':     new FormControl('',[Validators.required])
    }); 
  } // Cierre del método formafb
  
consultaDatosProdymat(){
    this.activatedRoutee.params.subscribe( params =>{ 
        this.prodymatService.prodymatUnico(params['clveProduc'])
        .pipe(first())
        .subscribe( 
            data => {
                this.datawork = data;
                if (this.datawork.cr=="00"){
                    this.currentProdymat = this.datawork.contenido;
                    this.editprodymat.controls['clveProduc'].setValue(this.currentProdymat.clveProduc);
                    this.editprodymat.controls['tipProd'].setValue(this.currentProdymat.tipProd);
                    this.editprodymat.controls['descCorta'].setValue(this.currentProdymat.descCorta);
                    this.editprodymat.controls['descLarga'].setValue(this.currentProdymat.descLarga);
                    this.editprodymat.controls['descCorIng'].setValue(this.currentProdymat.descCorIng);
                    this.editprodymat.controls['descLarIng'].setValue(this.currentProdymat.descLarIng);
                    this.editprodymat.controls['tip_Mat'].setValue(this.currentProdymat.tip_Mat);

                    this.clveProduc			= this.currentProdymat.clveProduc;
                    this.tipProd        = this.currentProdymat.tipProd   ;
                    this.indVis         = this.currentProdymat.indVis    ;
                    this.descCorta      = this.currentProdymat.descCorta ;
                    this.descLarga      = this.currentProdymat.descLarga ;
                    this.descCorIng     = this.currentProdymat.descCorIng;
                    this.descLarIng     = this.currentProdymat.descLarIng;
                    this.uM             = this.currentProdymat.uM        ;
                    this.empresa        = this.currentProdymat.empresa   ;
                    this.recinto        = this.currentProdymat.recinto   ;
                    this.fechaAlta      = this.currentProdymat.fechaAlta ;
                    this.fechaMod       = this.currentProdymat.fechaMod  ;
                    this.hora           = this.currentProdymat.hora      ;
                    this.userMod        = this.currentProdymat.userMod   ;
                    this.tip_Mat        = this.currentProdymat.tip_Mat      
                    
                    if(this.indVis == 'S'){
                      this.editprodymat.controls['gender'].setValue('S');
                    }else if(this.indVis == 'N'){
                      this.editprodymat.controls['gender'].setValue('N');
                    }
                    for (let i=0; i < this.prod.length; i++){ 
                      if (this.prod[i].Tipo == this.tipProd){
                        this.editprodymat.controls['tipProd'].setValue(this.prod[i].desc);
                      }
                    }
                   
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
    get f() { return this.editprodymat.controls; }
  
  enviar() {
    console.log("editsysuser enviar currentProdymat")
/*    
    if (this.editsysuserform.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
    */
        this.armausuario();
        console.log(this.currentProdymat)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewsysuser';
        this.prodymatService.editprodymat(this.currentProdymat)
          .pipe(first())
          .subscribe(
              data => {
                this.dataworkedit = data;
                if (this.dataworkedit.cr=="00"){
                    this.msgokpm();                    
                }
              },
              error => {
                this.alertService.error("Error al enviar el usuario");
                this.loading = false;
              });    
               
      
    } //     Cierre del metodo enviar
  
    armausuario(){
      //this.payLoad = JSON.stringify(this.form.value);
        this.currentProdymat = {
            clveProduc    : this.f.clveProduc.value,
            tipProd       : this.f.tipProd.value,  
            indVis        : this.f.gender.value, 
            descCorta     : this.f.descCorta.value, 
            descLarga     : this.f.descLarga.value, 
            descCorIng    : this.f.descCorIng.value, 
            descLarIng    : this.f.descLarIng.value, 
            uM            : this.f.listaallapl.value, 
            empresa	      : this.empresa,
            recinto       : this.recinto,
            fechaAlta     : this.fechaAlta,
            fechaMod      : this.curr,
            hora          : this.curr1, 
            userMod       : this.usuario.substring(0, 8),
            tip_Mat       : this.f.tip_Mat.value
        }
        if (this.f.listaallapl.value == ""){
            this.currentProdymat.uM = this.uM
        } 
    }     // Cierre del metodo armausuario

    consultaDatosApl(){
      this.clvap = 'AP07';
      this.consape.apeconscve(this.clvap)
      .pipe(first())
      .subscribe(
          data => {
              this.datawork = data;
              if (this.datawork.cr=="00"){
                  this.apl = this.datawork.contenido;
            }else {
              this.alertService.error("Las contraseñas no coinciden");
              this.loading = false;
          }
            error => {
              this.alertService.error("Error en el Alta de Usuario");
              this.loading = false;
          }});
    } // Cierre del método consultaDatosApl

    
  cancelar(clveProduc: string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
    this.router.navigate([this.returnUrl]);   
  }     // Cierre del metodo cancelar
  
  msgokpm(): void {
    const dialogRef = this.dialog.open(MsgokpmComponent, {
      width: '400px',
      height: '200px',
      //data: {idUsuario: this.idUsuario}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }    // Cierre del método msgok
}
  
  