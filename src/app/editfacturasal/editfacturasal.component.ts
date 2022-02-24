import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, FacturasService, CteyprovService,SysdtapeService, AduanalService, ProdymatService, ShareService } from './../service';
import { Facturas, Sysdtape, Login, Prodymat } from '../model'
import { delay, first } from 'rxjs/operators';
import { MsgokfComponent } from './../msgokf/msgokf.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-editfacturasal',
  templateUrl: './editfacturasal.component.html',
  styleUrls: ['./editfacturasal.component.css']
})
export class EditfacturasalComponent implements OnInit {
  CurrentDate         = new Date();
  curr                = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1               = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  pais                : string;
  descEsp             : string;
  descIng             : string;
  dataPais            : Sysdtape;
  editfacturasal      : FormGroup;
  dataworkedit        : any=[];
  currentFacturas     : Facturas;
  totalExist          : number =0;
  contExist           : number = 0;
  cantSdo             : number = 0;
  cantDisp            : number = 0;
  cantCont            : number = 0;
  dataTC              : string;
  dataProd            : Prodymat;

  
  idCliProv			      : string;
  numPart				      : string;
  numFact             : string;
  iDImpoEexpo         : string;
  fechaEntrada        : string;
  tipoCambio          : number;
  paisFact            : string;
  numPedimentoEntrada : string;
  numPedimentoSalida  : string;
  cLVPedi             : string;
  numPate             : string;
  aduana              : string;
  producto            : string;
  cantidad            : number;
  costounitdls        : number;
  costoTotaldls       : number;
  costounitMXP        : number;
  costototalMXP       : number;
  unidadDeMedida      : string;
  fraccAranc          : string;
  netoOriginal        : number;
  brutoOriginal       : number;
  netoConv            : number;
  brutoConv           : number;
  transport           : string;
  clieOrig            : string;
  clieDest            : string;
  iNCOTERM            : string;
  nUMPlacaTr          : string;
  nUMGuia             : string;
  contCaja            : string;
  selloCand1          : string;
  selloCand2          : string;
  selloCand3          : string;
  nombChofTr          : string;
  pO                  : string;
  empresa             : string;
  recinto             : string;
  observaciones       : string;
  fechaAlta           : string;
  fechaMod            : string;
  hora                : string;
  userMod             : string;
  estatus             : string = 'G';
  entSal              : string = 'S';
  consParm            : string = 'F';
  
  datacLVPedi         : any[]=[];
  datanumPate         : any[]=[];
  dataaduana          : any[]=[];
  dataincoterm        : any[]=[];
  datatransport       : any[]=[];
  dataclieOrig        : any[]=[];
  dataclieDest        : any[]=[];
  datawork            : any=[];
  orders              = [];
  listExist           : any[]=[];
  dataExist           : any[]=[];
  dataTrasp           : any[]=[];
  dataworkprod        : any=[];
  datadesMC           : any[];
  datadesMT           : any[];
  datafact            : any[];

  clvap               : string;
  tipo                : string;
  msg                 = '';
  usuari              : Login
  usuario             : string;
  empresaa            : string;
  recintoo            : string;
  loading             = false;
  returnUrl           : string;
  factor              : number;
  nico                : string;
  uMC                 : string;
  uMT                 : string;
  MonManda            : boolean=false;
  ConDescr            : boolean=false;
  bandDelete          : boolean=false;
  bandAut             : boolean=false;
  bandDelReg          : string = '0';
  bandDelReg1         : string;
  opc                 : string = '0';
  CteParam            : string = "";


  

  constructor(
    @Inject(LOCALE_ID) public locale : string,
    private consprod                 : ProdymatService,
    private consape                  : SysdtapeService,
    private shareService             : ShareService,
    private facturasService          : FacturasService,
    private activatedRoutee          : ActivatedRoute,
    private conscte                  : CteyprovService,
    private aduanalService           : AduanalService,
    private fb                       : FormBuilder,
    private route                    : ActivatedRoute,
    private router                   : Router,
    private alertService             : AlertService,
    private dialog                   : MatDialog,
  ) { 
    this.orders = this.getOrders();
  }
     
  ngOnInit(): void {
    this.obtenTC();
    this.clvap     = 'AP01';
    this.consultaDatosApl(this.clvap);    
    this.clvap     = 'AP02';
    this.consultaDatosApl(this.clvap);
    this.clvap     = 'AP04';
    this.consultaDatosApl(this.clvap);
    this.clvap     = 'AP14';
    this.consultaDatosApl(this.clvap);
    this.tipo      = '2';   
    this.consultaTipoCte(this.tipo);
    this.tipo      = '5';
    this.consultaTipoCte(this.tipo);
    this.llenaAduanal();
    this.consultaDatosFactura();
    this.formafb();
    this.consultaProdymat();
    this.usuari    = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario    = this.usuari["idUsuario"];
    let empresaa   = this.usuari["idEmpresa"];
    let recintoo   = this.usuari["idRecinto"];
    this.usuario   = usuario;
    this.empresa   = empresaa;
    this.recinto   = recintoo;
    this.loading = true;
    
/*    
    this.catClientes();
    if (this.CteParamBol) {
      this.editfacturasal.controls['idCliProv'].setValue(this.CteParam);
      this.catPartCtee(this.CteParam);
    }
*/
  }

  getOrders() {
    return [
      { id: "1", name: "Importación" },
      { id: "2", name: "Exportación" }
    ];
  }

  obtenTC(){
    this.shareService.tipoCambio()
    .pipe(first())
    .subscribe(
        data => {
          if (data.bmx.series[0].idSerie ==  "SF43718"){          
             this.dataTC  = data.bmx.series[0].datos[0].dato;
             this.editfacturasal.controls['tipCambio'   ].setValue(this.dataTC);
             this.loading = true;
        }},
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Clientes");              
          this.loading = false;
        });
  } // Cierre del método obtenTC

  
  consultaDatosApl(clvap){
    this.consape.apeconscve(clvap)
    .pipe(first())
    .subscribe(
        data => {
            this.datawork = data;
            if (this.datawork.cr=="00"){
              if (clvap =='AP01'){
                this.dataaduana      = this.datawork.contenido;
              }
              if (clvap =='AP02'){
                this.datacLVPedi     = this.datawork.contenido;
              }
              if (clvap =='AP04'){
                this.dataPais        = this.datawork.contenido;
              }
              if (clvap =='AP14'){
                this.dataincoterm    = this.datawork.contenido;
              }
            }else {
                this.datawork.descripcion
                this.alertService.error("Error al obtener información Error: "+ this.datawork.descripcion + " " + clvap);
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en la Consulta Datos Apl" + clvap);
            this.loading = false;
        });
  } // Cierre del método consultaDatosApl 


  consultaTipoCte(tipo){
    this.conscte.consTipoCte(tipo)
    .pipe(first())
    .subscribe(
        data => {
            this.datawork = data;
            if (this.datawork.cr=="00"){
              if (tipo =='2'){
                this.dataclieOrig    = this.datawork.contenido;
                this.dataclieDest    = this.datawork.contenido;
              }
              if (tipo =='5'){
                this.datatransport   = this.datawork.contenido;
              }
            }else {
                this.datawork.descripcion
                this.alertService.error("Error al obtener información Error: "+ this.datawork.descripcion + " " + tipo);
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en la Consulta Tipo de Cliente");
            this.loading = false;
        });
  } // Cierre del método consultaTipoCte 

  
  llenaAduanal()  {    
    this.aduanalService.llenaAduanal(1, 6)
    .pipe(first())
    .subscribe(
      data => {
        console.log("llenaAduanal   Data")  
        console.log(data)        
          if (data.cr=="00"){
              this.datanumPate  = data.contenido.sysAgads;
              console.log("llenaAduanal currentAduanal")
              console.log(this.datanumPate)  
          }else{
              this.loading = false;
              this.msg = data.descripcion;
              this.alertService.error(this.msg);
        }
      },
        error => {
            this.alertService.error("No hay conexión con la Base de Datos Aduanal");
            this.loading = false;
        });
  }  // Cierre del método llenaAduanal


  consultaDatosFactura(){
    this.activatedRoutee.params.subscribe( params =>{ 
        this.facturasService.facturaUnica(params['idCliProv'],params['numPart'],params['numFact'])  
        .pipe(first())
        .subscribe( 
            data => {
                this.datawork = data;
                console.log(" data consultaDatosFactrua ")
                console.log(this.orders)
                if (this.datawork.cr=="00"){
                    this.currentFacturas     = this.datawork.contenido;
                    this.editfacturasal.controls['idCliProv'         ].setValue(this.currentFacturas.idCliProv					); 
                    this.editfacturasal.controls['empresa'           ].setValue(this.currentFacturas.empresa            ); 
                    this.editfacturasal.controls['recinto'           ].setValue(this.currentFacturas.recinto            ); 
                    this.editfacturasal.controls['orders'            ].setValue(this.currentFacturas.iDImpoEexpo        );
                    this.editfacturasal.controls['numPedimentoSalida'].setValue(this.currentFacturas.numPedimentoSalida ); 
                    this.editfacturasal.controls['numFact'           ].setValue(this.currentFacturas.numFact            ); 
                    this.editfacturasal.controls['tipCambio'         ].setValue(this.currentFacturas.tipoCambio         ); 
                    this.editfacturasal.controls['nUMGuia'           ].setValue(this.currentFacturas.nUMGuia            ); 
                    this.editfacturasal.controls['nUMPlacaTr'        ].setValue(this.currentFacturas.nUMPlacaTr         ); 
                    this.editfacturasal.controls['contCaja'          ].setValue(this.currentFacturas.contCaja           ); 
                    this.editfacturasal.controls['selloCand1'        ].setValue(this.currentFacturas.selloCand1         ); 
                    this.editfacturasal.controls['selloCand2'        ].setValue(this.currentFacturas.selloCand2         ); 
                    this.editfacturasal.controls['selloCand3'        ].setValue(this.currentFacturas.selloCand3         ); 
                    this.editfacturasal.controls['NombChofTR'        ].setValue(this.currentFacturas.nombChofTr         ); 
                    this.editfacturasal.controls['po'                ].setValue(this.currentFacturas.pO                 ); 
                    this.editfacturasal.controls['producto'          ].setValue(this.currentFacturas.producto           ); 
                    this.editfacturasal.controls['cantidad'          ].setValue(this.currentFacturas.cantidad           ); 
//                    this.editfacturasal.controls['uMC'               ].setValue(this.currentFacturas.unidadDeMedida     ); 
                    this.editfacturasal.controls['fraccAranc'        ].setValue(this.currentFacturas.fraccAranc         ); 
                    this.editfacturasal.controls['costoUnitMXP'      ].setValue(this.currentFacturas.costounitMXP       ); 
                    this.editfacturasal.controls['costototalMXP'     ].setValue(this.currentFacturas.costototalMXP      ); 
                    this.editfacturasal.controls['costoUnitDLS'      ].setValue(this.currentFacturas.costounitdls       ); 
                    this.editfacturasal.controls['costoTotaldls'     ].setValue(this.currentFacturas.costoTotaldls      ); 
                    this.editfacturasal.controls['netoOriginal'      ].setValue(this.currentFacturas.netoOriginal       ); 
                    this.editfacturasal.controls['brutoOriginal'     ].setValue(this.currentFacturas.brutoOriginal      ); 
                    this.editfacturasal.controls['netoConv'          ].setValue(this.currentFacturas.netoConv           ); 
                    this.editfacturasal.controls['brutoConv'         ].setValue(this.currentFacturas.brutoConv          ); 

                    this.idCliProv      		       = this.currentFacturas.idCliProv		      ;   
                    this.empresa                   = this.currentFacturas.empresa           ;  
                    this.recinto                   = this.currentFacturas.recinto           ;  
                    this.iDImpoEexpo               = this.currentFacturas.iDImpoEexpo       ;  
                    this.numPedimentoSalida        = this.currentFacturas.numPedimentoSalida;  
                    this.numFact      		         = this.currentFacturas.numFact		        ;   
                    this.paisFact                  = this.currentFacturas.paisFact          ;  
                    this.tipoCambio                = this.currentFacturas.tipoCambio        ;  
                    this.cLVPedi                   = this.currentFacturas.cLVPedi           ;  
                    this.numPate                   = this.currentFacturas.numPate           ;  
                    this.aduana                    = this.currentFacturas.aduana            ;  
                    this.iNCOTERM                  = this.currentFacturas.iNCOTERM          ;  
                    this.nUMGuia                   = this.currentFacturas.nUMGuia           ;  
                    this.transport                 = this.currentFacturas.transport         ;  
                    this.nUMPlacaTr                = this.currentFacturas.nUMPlacaTr        ;  
                    this.contCaja                  = this.currentFacturas.contCaja          ;  
                    this.selloCand1                = this.currentFacturas.selloCand1        ;  
                    this.selloCand2                = this.currentFacturas.selloCand2        ;  
                    this.selloCand3                = this.currentFacturas.selloCand3        ;  
                    this.nombChofTr                = this.currentFacturas.nombChofTr        ;  
                    this.pO                        = this.currentFacturas.pO                ;  
                    this.clieOrig                  = this.currentFacturas.clieOrig          ;  
                    this.clieDest                  = this.currentFacturas.clieDest          ;  
                    this.producto                  = this.currentFacturas.producto          ;  
                    this.cantidad                  = this.currentFacturas.cantidad          ;  
                    this.unidadDeMedida            = this.currentFacturas.unidadDeMedida    ;  
                    this.fraccAranc                = this.currentFacturas.fraccAranc        ;  
                    this.costounitMXP              = this.currentFacturas.costounitMXP      ;  
                    this.costototalMXP             = this.currentFacturas.costototalMXP     ;  
                    this.costounitdls              = this.currentFacturas.costounitdls      ;  
                    this.costoTotaldls             = this.currentFacturas.costoTotaldls     ;  
                    this.netoOriginal              = this.currentFacturas.netoOriginal      ;  
                    this.brutoOriginal             = this.currentFacturas.brutoOriginal     ;  
                    this.netoConv                  = this.currentFacturas.netoConv          ;  
                    this.brutoConv                 = this.currentFacturas.brutoConv         ;  
/*
                   this.pais   = this.paisFact;
*/
                  if (this.currentFacturas.estatus == "A"){
                    this.loading   = false;
                    this.msg       = "  REGISTRO AUTORIZADO, FAVOR DE REALIZAR EL TRASPASO  ";
                    this.alertService.error(this.msg);
                  }
                  else{}
                }else{
                    this.loading = false;
                    this.msg     = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                }
            },
            error => {
                this.alertService.error("Error al momento de editar el agente aduanal");
                this.loading = false;
            });   
        })
  }     // Cierre del método consultaSysUser

  
  // convenience getter for easy access to form fields
    get f() { return this.editfacturasal.controls; }


  formafb() {
    this.editfacturasal = this.fb.group({
      'idCliProv':         new FormControl(''),
      'empresa':           new FormControl(''),
      'recinto':           new FormControl(''),
      'listaallCte':       new FormControl(''),     
      'numPedimentoSalida':new FormControl(''),
      'numFact':           new FormControl('',[Validators.required]),
      'orders':            new FormControl('',[Validators.required]),
      'listaallpais':      new FormControl('',[Validators.required]),
      'tipCambio':         new FormControl('',[Validators.required]),
      'listaallcLVPedi':   new FormControl('',[Validators.required]),
      'listaallnumPate':   new FormControl('',[Validators.required]),
      'listaalladuana':    new FormControl('',[Validators.required]),
      'listaallincoterm':  new FormControl('',[Validators.required]),
      'nUMGuia':           new FormControl('',[Validators.required]),
      'listaalltransport': new FormControl('',[Validators.required]),
      'nUMPlacaTr':        new FormControl('',[Validators.required]),
      'contCaja':          new FormControl('',[Validators.required]),
      'selloCand1':        new FormControl('',[Validators.required]),
      'selloCand2':        new FormControl('',[Validators.required]),
      'selloCand3':        new FormControl('',[Validators.required]),
      'NombChofTR':        new FormControl('',[Validators.required]),
      'po':                new FormControl('',[Validators.required]),
      'listaallclieOrig':  new FormControl('',[Validators.required]),
      'listaallclieDest':  new FormControl('',[Validators.required]),
      'producto':          new FormControl(''),
      'listaallprod':      new FormControl('',[Validators.required]),
      'descIngles':        new FormControl('',[Validators.required]),
      'cantidad':          new FormControl('',[Validators.required]),
      'uMC':               new FormControl('',[Validators.required]),
      'fraccAranc':        new FormControl('',[Validators.required]),
      'costoUnitMXP':      new FormControl('',[Validators.required]),
      'costototalMXP':     new FormControl('',[Validators.required]),
      'costoUnitDLS':      new FormControl('',[Validators.required]),
      'costoTotaldls':     new FormControl('',[Validators.required]),
      'netoOriginal':      new FormControl('',[Validators.required]),
      'brutoOriginal':     new FormControl('',[Validators.required]),
      'netoConv':          new FormControl('',[Validators.required]),
      'brutoConv':         new FormControl('',[Validators.required])
}); 
  } // Cierre del método formafb

  
  consultaProdymat(){    
    this.consprod.prodymatTodos(this.opc)
    .pipe(first())
    .subscribe(
        data => {
            this.dataworkprod = data;
            if (this.dataworkprod.cr=="00"){
                console.log("editfacturasal.component consultaProdymat dataworkprod data/dataworkprod")
                console.log(data)
                console.log(this.dataworkprod)
                this.dataProd    = this.dataworkprod.contenido.sysCatProductos;
                this.datadesMC   = this.dataworkprod.contenido.lDescripUMC
                this.datadesMT   = this.dataworkprod.contenido.lDescripuMT
                this.datafact    = this.dataworkprod.contenido.lFactor
                console.log(this.producto)
                for (let y=0; y < this.dataworkprod.contenido.sysCatProductos.length; y++){ 
                    console.log(this.dataworkprod.contenido.sysCatProductos[y].clveProduc);
                    if (this.dataworkprod.contenido.sysCatProductos[y].clveProduc == this.producto){
//                        console.log(this.dataworkprod.contenido.sysCatProductos[y].descCorIng)
//                        console.log(this.dataworkprod.contenido.sysCatProductos[y].descCorta)
                        this.editfacturasal.controls['descIngles'].setValue(this.dataworkprod.contenido.sysCatProductos[y].descCorIng);
                        this.descEsp      = this.dataworkprod.contenido.sysCatProductos[y].descCorta;
                        this.editfacturasal.controls['listaallprod'].setValue(this.dataworkprod.contenido.sysCatProductos[y].descCorta);
                        this.descEsp      = this.dataworkprod.contenido.sysCatProductos[y].descCorta;
                        this.editfacturasal.controls['uMC'].setValue(this.dataworkprod.contenido.lDescripUMC[y]);
                        this.uMC          = this.dataworkprod.contenido.sysCatProductos[y].uMC;
                        y = this.dataworkprod.contenido.sysCatProductos.length;
                    }
                }
            }else {
                this.alertService.error("Error al obtener información de Productos");
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en el Consulta de Prodcutos");
            this.loading = false;
        });
  } // Cierre del método consultaProdymat

  cambio(id1: any){
    console.log("cambio dataworkprod")
    console.log(this.dataworkprod.contenido[id1.target.value])
    console.log(this.dataworkprod.contenido.sysCatProductos[id1.target.value])

    this.editfacturasal.controls['uMC'].setValue(this.dataworkprod.contenido.lDescripUMC[id1.target.value]);
    this.editfacturasal.controls['producto'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);
    this.editfacturasal.controls['descIngles'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].descCorIng);
    this.editfacturasal.controls['fraccAranc'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].fraccAranc);
    this.factor = this.dataworkprod.contenido.lFactor[id1.target.value]

    this.descEsp      = this.dataworkprod.contenido.sysCatProductos[id1.target.value].descCorta;
//    this.editfacturasal.controls['listaallprod'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].descCorta);

    this.nico        = this.dataworkprod.contenido.sysCatProductos[id1.target.value].nico
    this.uMC         = this.dataworkprod.contenido.sysCatProductos[id1.target.value].uMC
    this.uMT         = this.dataworkprod.contenido.sysCatProductos[id1.target.value].uMT

    this.ConDescr = true;

    let cliente   : string;
  
    if (this.dataworkprod.contenido.sysCatProductos[id1.target.value].monedaMandataria == 'MXP'){
        this.MonManda = true;

        this.editfacturasal.controls['costoUnitMXP'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitMXP);
        let CUnitUSD = this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitMXP / this.f.tipCambio.value ;
        this.editfacturasal.controls['costoUnitDLS'].setValue(CUnitUSD);

        let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
        let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
        this.editfacturasal.controls['costototalMXP'].setValue(CTotalMxp);
        this.editfacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
    }

    if (this.dataworkprod.contenido.sysCatProductos[id1.target.value].monedaMandataria == 'USD'){
      this.MonManda = false;

      this.editfacturasal.controls['costoUnitDLS'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitDLS);
      let CUnitMXP = this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitDLS * this.f.tipCambio.value ;
      this.editfacturasal.controls['costoUnitMXP'].setValue(CUnitMXP);

      let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
      let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
      this.editfacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
      this.editfacturasal.controls['costototalMXP'].setValue(CTotalMxp);
    }
    cliente   = this.f.idCliProv.value; 
    this.obtenExistencia(cliente, this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);
  }    // Cierre del método cambio


  TotalMXP(){
    let CUnitUSD = this.f.costoUnitMXP.value / this.f.tipCambio.value ;
    this.editfacturasal.controls['costoUnitDLS'].setValue(CUnitUSD);

    let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
    let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
    this.editfacturasal.controls['costototalMXP'].setValue(CTotalMxp);
    this.editfacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
  }


  TotalUSD(){
    let CUnitMXP = this.f.costoUnitDLS.value * this.f.tipCambio.value ;
    this.editfacturasal.controls['costoUnitMXP'].setValue(CUnitMXP);

    let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
    let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
    this.editfacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
    this.editfacturasal.controls['costototalMXP'].setValue(CTotalMxp);
  }


  netoConvertido(){
    console.log("factor")
    console.log(this.factor)
    let NetoConv     = this.factor * this.f.netoOriginal.value
    this.editfacturasal.controls['netoConv'].setValue(NetoConv);
  }    // Cierre del método netoConvertido


  brutoConvertido(){
    console.log("factor")
    console.log(this.factor)
    let BrutoConv    = this.factor * this.f.brutoOriginal.value
    this.editfacturasal.controls['brutoConv'].setValue(BrutoConv);
  }    // Cierre del método brutoConvertido

  
  cambExist(cant: any){
    console.log("cambExist")
    console.log(cant)
    console.log(cant.target.value)
    console.log(this.totalExist)
    if (cant.target.value > this.totalExist) {
      this.alertService.error("La cantidad no puede ser mayor a " + this.totalExist);
      this.loading = false;
    }else{ if (cant.target.value == 0) {
      this.alertService.error("La cantidad debe ser mayor a cero");
      this.loading = false;
    }else{if (this.dataworkprod.contenido.sysCatProductos[this.f.listaallprod.value].monedaMandataria == 'MXP'){
        this.loading = true;
        console.log("PESOS")
        this.TotalMXP()
      }else{
        this.loading = true;
        console.log("DOLARES")
        this.TotalUSD()
      }        
    }
   }
  } // Cierre del método cambExist
  

  obtenExistencia(idCliProv, producto){
    this.totalExist   = 0;
    this.contExist    = 0;
    this.listExist    = [];
    console.log("obtenExistencia parráfo")
    console.log(idCliProv);
    console.log(producto)
    this.facturasService.obtenExistenciaInv(idCliProv, producto, this.consParm)
    .pipe(first())
    .subscribe(
      data => {
        this.dataExist = data.contenido
        console.log("obten Cantidad INV data contenido dataExist ")   
        console.log(this.dataExist)
          if (data.cr=="00"){
              console.log("obtenExistenciaInv  CR = 0")

              this.dataExist.forEach(item =>{
                this.listExist.push({
                      "idCliProv"  : item[0],
                      "NumPart"    : item[1],
                      "NumPedEnt"  : item[2],
                      "FecEnt"     : item[3],
                      "Producto"   : item[4],
                      "idImpExp"   : item[5],
                      "NumFact"    : item[6],
                      "Consumidas" : item[7],
                      "Total"      : item[8]});
                this.totalExist = this.totalExist + item[8] - item[7]
                this.contExist  = this.contExist + 1
                console.log(" FOREACH INV==> ")
                console.log(this.listExist)
                console.log(this.totalExist)
             });
             if (this.totalExist == 0){
              console.log("ENTRE A BORRAR LOS CAMPOS POR SER CERO")
              this.editfacturasal.controls['uMC'].setValue("");
              this.editfacturasal.controls['producto'].setValue("");
              this.editfacturasal.controls['descIngles'].setValue("");
              this.editfacturasal.controls['fraccAranc'].setValue("");
              this.editfacturasal.controls['costoUnitMXP'].setValue(0);
              this.editfacturasal.controls['costoUnitDLS'].setValue(0);
            }
             this.editfacturasal.controls['cantidad'].setValue(this.totalExist);
             let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
             let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
             this.editfacturasal.controls['costototalMXP'].setValue(CTotalMxp);
             this.editfacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
             console.log (" acabo de calcular cantidad " + this.f.cantidad.value)
          }else{
              this.loading = false;
              this.msg = data.descripcion;
              this.alertService.error(this.msg);
        }
      },
        error => {
            this.alertService.error("No hay conexión con la Base de Datos");
            this.loading = false;
        });
  }  // Cierre del método obtenCantidad


  
  guardar() {
    console.log("guardar")
    console.log(this.totalExist)
    console.log(this.contExist)
    console.log(this.f.cantidad.value)

    this.cantSdo   = 0;   
    this.cantCont  = 0;
    this.cantSdo   = this.f.cantidad.value;   
/*    
    if (this.editfacturasal.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
*/    
      this.borraFacturas(this.f.idCliProv.value, this.f.producto.value, this.f.numFact.value); 
  }

  enviar1(){
    console.log("banDelete enviar1")
    console.log(this.bandDelete)    
    if (this.bandDelete){

    if (this.f.cantidad.value <= this.totalExist){
      for (let y=0; y < this.contExist; y++){ 
        if (this.cantSdo > 0){
          console.log("dentro de Y ")
          console.log(y)
          console.log(this.cantCont)
          this.cantCont = this.cantCont + 1;
          this.cantSdo  =  this.cantSdo - this.listExist[y].Total
          console.log("Despues ")
          console.log(this.cantCont)
        }
      }
    }

    console.log("VOY AL FOR ")
    console.log(this.cantCont)
    this.cantSdo = this.f.cantidad.value; 
    for (let i=0; i < this.cantCont; i++){ 
        console.log("enviar for ")
        console.log(i)
        console.log(this.cantSdo)
  
        this.armausuario(i);
        if (this.cantSdo >= this.listExist[i].Total){
          console.log("dentro del if ")
          console.log(this.cantSdo)
         this.currentFacturas.cantidad = this.listExist[i].Total
         this.cantSdo  =  this.cantSdo - this.listExist[i].Total
     }else{
         console.log("dentro del if 2")
         console.log(this.cantSdo)
         this.currentFacturas.cantidad        = this.cantSdo
     }
        console.log("editfacturasal.component.ts enviar currentFacturas")
        console.log(this.currentFacturas)

        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/facturasal';
        this.facturasService.altafacturas(this.currentFacturas)
          .pipe(first())
          .subscribe(
              data => {
                this.dataworkedit = data;
                if (this.dataworkedit.cr=="00"){
                  console.log("Di uno de alta ")
                  console.log(i)
                  console.log(this.cantCont)
                  if (i+1 == this.cantCont ){
                    this.msgokf();
                  }
                }else{
                  this.loading   = false;
                  this.msg       = this.datawork.descripcion;
                  this.alertService.error(this.msg);
              }              
              error => {
                this.alertService.error("Error al enviar el agente aduanal");
                this.loading = false;
              }
            });
          }
        }else{
          this.loading   = false;
          this.msg       = this.datawork.descripcion;
          this.alertService.error("No existen registros a borrar");
        }
              return ;
  } //     Cierre del metodo enviar
  
  //borraFacturas(idCliProv, producto, factSal){
  borraFacturas(idCliProv, producto, factSal){
    console.log("Borra Facturas método")
    console.log(idCliProv)
    console.log(producto)
    console.log(factSal)
    this.facturasService.borrarFacturas(idCliProv, producto, factSal)
    .pipe(first())
    .subscribe(
      data => {
        console.log("borraFacturas método1 ")   
        console.log(data)
          if (data.cr=="00"){
              console.log("borraFacturas  CR = 0")
              this.bandDelete = true;
              this.bandDelReg = '1';  
              this.enviar1();            
          }else{
              this.bandDelReg = '0';
              this.loading = false;
              this.msg = data.descripcion;
              this.alertService.error(this.msg);
        }
      },
        error => {
            this.alertService.error("No hay conexión con la Base de Datos");
            this.loading = false;
        });
        console.log("Return")
        console.log(this.bandDelete)
        console.log(this.bandDelReg)
        return
  }  // Cierre del método borraFacturas

    
    autorizar() {
      console.log("autorizar ")
      this.bandAut  = true;      
      console.log("Band Aut ")
      console.log(this.bandAut)
      this.guardar();
    }


    armausuario(i){    
      this.currentFacturas = {
          idCliProv             : this.f.idCliProv.value                ,
          numPart							  : this.listExist[i].NumPart             ,   
          numFact               : this.f.numFact.value                  ,    
          iDImpoEexpo           : this.f.orders.value                   ,   
          fechaEntrada          : this.listExist[i].FecEnt              ,   
          numPedimentoEntrada   : this.listExist[i].NumPedEnt           ,   
          paisFact              : this.f.listaallpais.value             ,   
          numPedimentoSalida    : this.f.numPedimentoSalida.value       , 
          cLVPedi               : this.f.listaallcLVPedi.value          ,     
          numPate               : this.f.listaallnumPate.value          ,   
          aduana                : this.f.listaalladuana.value           ,   
          transport             : this.f.listaalltransport.value        ,   
          clieOrig              : this.f.listaallclieOrig.value         ,   
          clieDest              : this.f.listaallclieDest.value         ,     
          iNCOTERM              : this.f.listaallincoterm.value         ,   
          nUMPlacaTr            : this.f.nUMPlacaTr.value               ,   
          nUMGuia               : this.f.nUMGuia.value                  ,   
          contCaja              : this.f.contCaja.value                 ,   
          selloCand1            : this.f.selloCand1.value               ,     
          selloCand2            : this.f.selloCand2.value               ,     
          selloCand3            : this.f.selloCand3.value               ,   
          nombChofTr            : this.f.NombChofTR.value               ,   
          pO                    : this.f.po.value                       ,   
          observaciones         : this.f.NombChofTR.value               ,   

          tipoCambio            : this.f.tipCambio.value                , 
          producto              : this.f.producto.value                 , 
          cantidad              : this.f.cantidad.value                 , 
          costounitdls          : this.f.costoUnitDLS.value             , 
          costoTotaldls         : this.f.costoTotaldls.value            , 
          costounitMXP          : this.f.costoUnitMXP.value             , 
          costototalMXP         : this.f.costototalMXP.value            , 
          unidadDeMedida        : this.uMC                              , 
          fraccAranc            : this.f.fraccAranc.value               , 
          netoOriginal          : this.f.netoOriginal.value             , 
          brutoOriginal         : this.f.brutoOriginal.value            , 
          netoConv              : this.f.netoConv.value                 , 
          brutoConv             : this.f.brutoConv.value                , 
          empresa               : this.f.empresa.value                  , 
          recinto               : this.f.recinto.value                  , 
          numFactEnt            : this.listExist[i].NumFact             ,

          estatus               : this.estatus                          , 
          entSal                : this.entSal                           ,
          fechaAlta             : this.curr                             , 
          fechaMod              : this.curr                             ,
          hora                  : this.curr1                            , 
          userMod               : this.usuario.substring(0, 8)          ,
     }    
      console.log("  this.bandAut en armausuario  ")
      console.log(this.bandAut)

      if (this.bandAut){
          this.currentFacturas.estatus  = "A" 
          console.log("  this.currentFacturas en armausuario  ")
          console.log(this.currentFacturas)
      }

      if (this.currentFacturas.aduana   == "" ) {
          this.currentFacturas.aduana   = this.aduana
      }

      if (this.currentFacturas.cLVPedi  == "" ) {
        this.currentFacturas.cLVPedi    = this.cLVPedi
      }

      if (this.currentFacturas.iNCOTERM == "" ) {
        this.currentFacturas.iNCOTERM   = this.iNCOTERM
      }

      if (this.currentFacturas.paisFact == "" ) {
        this.currentFacturas.paisFact   = this.paisFact
      }

      if (this.currentFacturas.numPate  == "" ) {
        this.currentFacturas.numPate    = this.numPate
      }

      if (this.currentFacturas.clieOrig == "" ) {
        this.currentFacturas.clieOrig   = this.clieOrig
      }

      if (this.currentFacturas.clieDest == "" ) {
        this.currentFacturas.clieDest   = this.clieDest
      }

      if (this.currentFacturas.transport == "" ) {
        this.currentFacturas.transport   = this.transport
      }
  }     // Cierre del metodo armausuario

  
  cancelar(clveProduc: string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/cteyprov';
    this.router.navigate([this.returnUrl]);   
  }     // Cierre del metodo cancelar


  traspaso(idCliProv, producto){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/altatraspasos/:idCliProv';
    this.router.navigate([this.returnUrl]);   
  }  // Cierre del método traspaso

  
  msgokf(): void {
    const dialogRef = this.dialog.open(MsgokfComponent, {
      width: '400px',
      height: '200px',
  });


  dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }    // Cierre del método msgok
}