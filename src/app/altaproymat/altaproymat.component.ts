import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, ProdymatService, SysdtapeService } from './../service';
import { Prodymat, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokpmComponent } from './../msgokpm/msgokpm.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';

interface Tipo {
  Tipo: string;
  desc: string;
}


@Component({
  selector: 'app-altaproymat',
  templateUrl: './altaproymat.component.html',
  styleUrls: ['./altaproymat.component.css']
})
export class AltaproymatComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1 = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  clvap: string;
  material: boolean=false;
  tipProdparam: boolean=false;
  altaprodymat: FormGroup;
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  submitted = false;
  msg= '';
  usuari: Login
  apC: Sysdtape;
  apT: Sysdtape;
  fracc: any[];

  datawork: any=[];
  dataworkfracc: any=[];
  disponibles: any;
  selectedLocations: any = [];
  currString: string;
  orders = [];
  usuario: string;
  empresa: string;
  recinto: string;
  cvePrMt: string;
  progUser='SYSALTAS';
  
  loading = false;
  returnUrl: string;
  currentProdymat: Prodymat;
  tipProd:       string;  

  listTipprod = [];
  prod: Tipo[] = [
    {Tipo: '6', desc: 'Productos'},
    {Tipo: '7', desc: 'Materiales'},
    {Tipo: '8', desc: 'Activo Fijo'}
  ];

  constructor(
    private consape: SysdtapeService,
    @Inject(LOCALE_ID) public locale: string,
    private fb: FormBuilder,
    private prodymatService: ProdymatService, 
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { 
        if (this.route.snapshot.paramMap.get('Tipo') != "0"  ){
          this.cvePrMt = this.route.snapshot.paramMap.get('Tipo');
          this.tipProdparam = true;
          console.log("con valor")
          console.log(this.cvePrMt)
        }else{
          this.tipProdparam = false;
          console.log("sin valor")
          this.cvePrMt = '0';
          this.listTipprod = this.prod;
          console.log("altaproymat.component contructor listTipProd")
          console.log(this.listTipprod)
        }
// mimic async orders
//        of(this.getOrders()).subscribe(orders => {
          this.orders = this.getOrders();
  }

  ngOnInit(): void {
        //this.clvap_pant = this.route.snapshot.queryParamMap.get('clvap');
    this.consultaDatosApl();
    this.consultaFracc();
    this.submitted = true;
    this.formafb();
    this.usuari = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario = this.usuari["idUsuario"];
    let empresa = this.usuari["idEmpresa"];
    let recinto = this.usuari["idRecinto"];
    this.usuario = usuario;
    this.empresa = empresa;
    this.recinto = recinto;
    if (this.tipProdparam) {
        for (let i=0; i < this.prod.length; i++){ 
        if (this.prod[i].Tipo == this.cvePrMt){
           this.altaprodymat.controls['tipProd'].setValue(this.prod[i].desc);
        }
      }
      if (this.cvePrMt=='7'){
        this.material = true;
      }
    }
    //let userMod = this.usuari["idUsuario"];
  } // Cierre del método ngOnInit

  formafb() {
        this.altaprodymat = this.fb.group({
          'clveProduc':    new FormControl('',[Validators.required]),
          'tipProd':       new FormControl(''),
          'listaTipProd':  new FormControl(''),
          'orders':        new FormControl('',[Validators.required]),
          'descCorta':     new FormControl('',[Validators.required]),
          'descLarga':     new FormControl('',[Validators.required]),
          'descCorIng':    new FormControl('',[Validators.required]),
          'descLarIng':    new FormControl('',[Validators.required]),
          'listaallapC':   new FormControl('',[Validators.required]),
          'listaallapT':   new FormControl('',[Validators.required]),
          'Tip_Mat':       new FormControl(''),
          'convers':       new FormControl('',[Validators.required]),
          'costoUnitDLS':  new FormControl('',[Validators.required]),
          'costoUnitMXP':  new FormControl('',[Validators.required]),
          'listaallFracc': new FormControl('',[Validators.required]),
          'nico':          new FormControl('',[Validators.required])
    }); 
  } // Cierre del método formafb

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
      this.altaprodymat.controls['tip_Mat'].setValue("");
   }
  }

  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
    this.router.navigate([this.returnUrl]);   
  }  // Cierre del método cancelar

// convenience getter for easy access to form fields
    get f() { return this.altaprodymat.controls; }

  enviar() {
    if (this.altaprodymat.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
//      if (this.tipProdparam ){
//         if (!this.tipProdparam && this.f.listaTipProd.value != null){
        this.armausuario();
        console.log ("altaproymat.component.ts enviar currentProdymat")
        console.log(this.currentProdymat)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
        this.prodymatService.altaprodymat(this.currentProdymat)
            .pipe(first())
            .subscribe(
                data => {
                    this.datawork = data;
                    if (this.datawork.cr=="00"){
                      this.msgokpm();
                  }else{
                    this.loading = false;
                    this.msg     = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                  }
                error => {
                  this.alertService.error("Error en el Alta de Productos y Materiales");
                  this.loading = false;
                }
              });
//            }else{
//              this.alertService.error("Favor de capturar el Tipo de Producto");
//              this.loading = false;
//            } 
//       }         
        return   
    } // Cierre del método enviar

  consultaDatosApl(){
    this.clvap = 'AP07';
    this.consape.apeconscve(this.clvap)
    .pipe(first())
    .subscribe(
        data => {
            this.datawork = data;
            if (this.datawork.cr=="00"){
                console.log("consultaDatosApl datawork contenido")
                console.log(data)
                console.log(this.datawork)
                this.apC = this.datawork.contenido;
                this.apT = this.datawork.contenido;
            }else {
                this.alertService.error("Error al obtener información de indices de Medidas");
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en el Consulta de Medidas");
            this.loading = false;
        });
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
    
  armausuario(){
      this.currentProdymat = {
          clveProduc    : this.f.clveProduc.value,
          tipProd       : this.f.listaTipProd.value,  
          indVis        : this.f.orders.value, 
          descCorta     : this.f.descCorta.value, 
          descLarga     : this.f.descLarga.value, 
          descCorIng    : this.f.descCorIng.value, 
          descLarIng    : this.f.descLarIng.value, 
          uMC           : this.f.listaallapC.value, 
          uMT           : this.f.listaallapT.value, 
          tipMat       : this.f.Tip_Mat.value,
          empresa	      : this.empresa,
          recinto       : this.recinto,
          fechaAlta     : this.curr,
          fechaMod      : this.curr,
          hora          : this.curr1, 
          userMod       : this.usuario.substring(0, 8),
          convers       : this.f.convers.value, 
          costoUnitDLS  : this.f.costoUnitDLS.value, 
          costoUnitMXP  : this.f.costoUnitMXP.value, 
          fraccAranc    : this.f.listaallFracc.value, 
          nico          : this.f.nico.value, 
      
      }    
      if (this.tipProdparam){
          this.currentProdymat.tipProd = this.cvePrMt
      }   
  }     // Cierre del metodo armausuario

  msgokpm(): void {
    const dialogRef = this.dialog.open(MsgokpmComponent, {
      width: '400px',
      height: '200px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }


} //Cierre principal
