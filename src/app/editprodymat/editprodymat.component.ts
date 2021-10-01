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
  apC: Sysdtape;
  apT: Sysdtape;
  fracc: any[];
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
  dataworkfracc: any=[];
  
  clveProduc:    string;
  tipProd:       string;  
  indVis:        string;
  descCorta:     string;
  descLarga:     string;
  descCorIng:    string;
  descLarIng:    string;
  uMC:           string;
  uMT:           string;
  tipMat:        string;
  empresa:       string;
  recinto:       string;
  fechaAlta:     string;
  fechaMod:      string;
  hora:          string;
  userMod:       string;
  convers:       number; 
  costoUnitDLS:  number;
  costoUnitMXP:  number;
  monedaMandataria : string;
  fraccAranc:    string;
  nico:          string; 
  
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
    this.consultaFracc();
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
       this.editprodymat.controls['tipMat'].setValue("");
    }
   }
  
  formafb() {
    this.editprodymat = this.fb.group({
      'clveProduc':    new FormControl('',[Validators.required]),
      'tipProd':       new FormControl('',[Validators.required]),
      'gender':        new FormControl('',[Validators.required]),
      'orders':        new FormControl('',[Validators.required]),
      'descCorta':     new FormControl('',[Validators.required]),
      'descLarga':     new FormControl('',[Validators.required]),
      'descCorIng':    new FormControl('',[Validators.required]),
      'descLarIng':    new FormControl('',[Validators.required]),
      'listaallapC':   new FormControl('',[Validators.required]),
      'listaallapT':   new FormControl('',[Validators.required]),
      'listaallFracc': new FormControl('',[Validators.required]),
      'tipMat':        new FormControl(''),
      'convers':       new FormControl('',[Validators.required]),
      'costoUnitDLS':  new FormControl('',[Validators.required]),
      'costoUnitMXP':  new FormControl('',[Validators.required]),
      'monedaMandataria':  new FormControl('',[Validators.required]),
//      'fraccAranc':    new FormControl('',[Validators.required]),
      'nico':          new FormControl('',[Validators.required]),
    }); 
  } // Cierre del método formafb
  
consultaDatosProdymat(){
    console.log("1")
    this.activatedRoutee.params.subscribe( params =>{ 
        this.prodymatService.prodymatUnico(params['clveProduc'])
        .pipe(first())
        .subscribe( 
            data => {
                this.datawork = data;
                console.log("2")
                if (this.datawork.cr=="00"){
                  console.log("3")
                    this.currentProdymat = this.datawork.contenido;
                    console.log("editprodymat currentProdymat")
                    console.log(this.currentProdymat)
                    this.editprodymat.controls['clveProduc'].setValue(this.currentProdymat.clveProduc)    ;
                    this.editprodymat.controls['tipProd'].setValue(this.currentProdymat.tipProd)          ;
                    this.editprodymat.controls['descCorta'].setValue(this.currentProdymat.descCorta)      ;
                    this.editprodymat.controls['descLarga'].setValue(this.currentProdymat.descLarga)      ;
                    this.editprodymat.controls['descCorIng'].setValue(this.currentProdymat.descCorIng)    ;
                    this.editprodymat.controls['descLarIng'].setValue(this.currentProdymat.descLarIng)    ;
                    this.editprodymat.controls['tipMat'].setValue(this.currentProdymat.tipMat)            ;
                    this.editprodymat.controls['convers'].setValue(this.currentProdymat.convers)          ;
                    this.editprodymat.controls['costoUnitDLS'].setValue(this.currentProdymat.costoUnitDLS);
                    this.editprodymat.controls['costoUnitMXP'].setValue(this.currentProdymat.costoUnitMXP);
                    this.editprodymat.controls['monedaMandataria'].setValue(this.currentProdymat.monedaMandataria);
//                    this.editprodymat.controls['fraccAranc'].setValue(this.currentProdymat.fraccAranc)    ;
                    this.editprodymat.controls['nico'].setValue(this.currentProdymat.nico)                ;

                    this.clveProduc			= this.currentProdymat.clveProduc  ;
                    this.tipProd        = this.currentProdymat.tipProd     ;
                    this.indVis         = this.currentProdymat.indVis      ;
                    this.descCorta      = this.currentProdymat.descCorta   ;
                    this.descLarga      = this.currentProdymat.descLarga   ;
                    this.descCorIng     = this.currentProdymat.descCorIng  ;
                    this.descLarIng     = this.currentProdymat.descLarIng  ;
                    this.uMC            = this.currentProdymat.uMC         ;
                    this.uMT            = this.currentProdymat.uMT         ;
                    this.tipMat         = this.currentProdymat.tipMat      ;       
                    this.empresa        = this.currentProdymat.empresa     ;
                    this.recinto        = this.currentProdymat.recinto     ;
                    this.fechaAlta      = this.currentProdymat.fechaAlta   ;
                    this.fechaMod       = this.currentProdymat.fechaMod    ;
                    this.hora           = this.currentProdymat.hora        ;
                    this.userMod        = this.currentProdymat.userMod     ;
                    this.convers        = this.currentProdymat.convers     ;
                    this.costoUnitDLS   = this.currentProdymat.costoUnitDLS;
                    this.costoUnitMXP   = this.currentProdymat.costoUnitMXP;
                    this.costoUnitMXP   = this.currentProdymat.costoUnitMXP;
                    this.monedaMandataria = this.currentProdymat.monedaMandataria  ;
                    this.nico           = this.currentProdymat.nico        ;
                    console.log("editprodymat consultaDatosProdymat fraccAranc");
                    console.log(this.fraccAranc);
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
    console.log("editprodymat enviar fraccAranc");
    console.log(this.fraccAranc);
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
            clveProduc    : this.f.clveProduc.value     ,
            tipProd       : this.tipProd                ,  
            indVis        : this.f.gender.value         , 
            descCorta     : this.f.descCorta.value      , 
            descLarga     : this.f.descLarga.value      , 
            descCorIng    : this.f.descCorIng.value     , 
            descLarIng    : this.f.descLarIng.value     , 
            uMC           : this.f.listaallapC.value    , 
            uMT           : this.f.listaallapT.value    , 
            tipMat        : this.f.tipMat.value         ,
            empresa	      : this.empresa                ,
            recinto       : this.recinto                ,
            fechaAlta     : this.fechaAlta              ,
            fechaMod      : this.curr                   ,
            hora          : this.curr1                  , 
            userMod       : this.usuario.substring(0, 8),
            convers       : this.f.convers.value        ,
            costoUnitDLS  : this.f.costoUnitDLS.value   ,
            costoUnitMXP  : this.f.costoUnitMXP.value   ,
            monedaMandataria: this.f.monedaMandataria.value,
            fraccAranc    : this.f.listaallFracc.value     ,
            nico          : this.f.nico.value           ,
        }
        if (this.f.listaallapC.value == ""){
            this.currentProdymat.uMC = this.uMC
        } 
        if (this.f.listaallapT.value == ""){
            this.currentProdymat.uMT = this.uMT
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
                  this.apC = this.datawork.contenido;
                  this.apT = this.datawork.contenido;
            }else {
              this.alertService.error("Las contraseñas no coinciden");
              this.loading = false;
          }
            error => {
              this.alertService.error("Error en el Alta de Usuario");
              this.loading = false;
          }});
  } // Cierre del método consultaDatosApl

  consultaFracc(){
    this.prodymatService.obtenFracc()
    .pipe(first())
    .subscribe(
        data => {
            this.dataworkfracc = data;
            if (this.dataworkfracc.cr=="00"){
                this.fracc = this.dataworkfracc.contenido;
            }else {
                this.alertService.error("Error al obtener información de la Fracción Arancelaria");
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en la consulta de la Fracción Arancelaria");
            this.loading = false;
        });
  } // Cierre del método consultaFracc  

    
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
  
  