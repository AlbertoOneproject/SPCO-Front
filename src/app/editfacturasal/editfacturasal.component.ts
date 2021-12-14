import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, FacturasService, CteyprovService,SysdtapeService, AduanalService } from './../service';
import { Facturas, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokfComponent } from './../msgokf/msgokf.component'
import { MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-editfacturasal',
  templateUrl: './editfacturasal.component.html',
  styleUrls: ['./editfacturasal.component.css']
})
export class EditfacturasalComponent implements OnInit {
  pais                : string;
  descEsp             : string;
  descIng             : string;
  dataPais            : Sysdtape;
  editfacturasal      : FormGroup;
  dataworkedit        : any=[];
  currentFacturas     : Facturas;
  
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
  estatus             : string;
  entSal              : string;
  
  datacLVPedi         : any[]=[];
  datanumPate         : any[]=[];
  dataaduana          : any[]=[];
  dataincoterm        : any[]=[];
  datatransport       : any[]=[];
  dataclieOrig        : any[]=[];
  dataclieDest        : any[]=[];
  datawork            : any=[];

  clvap               : string;
  tipo                : string;
  msg                 = '';
  usuari              : Login
  usuario             : string;
  empresaa            : string;
  recintoo            : string;
  loading             = false;
  returnUrl           : string;
  

  constructor(
    @Inject(LOCALE_ID) public locale : string,
    private consape                  : SysdtapeService,
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
  }
     
  ngOnInit(): void {
    this.clvap     = 'AP01';
    this.consultaDatosApl(this.clvap);    
    this.clvap     = 'AP02';
    this.consultaDatosApl(this.clvap);
    this.clvap     = 'AP04';
    this.consultaDatosApl(this.clvap);
    this.clvap     = 'AP14';
    this.consultaDatosApl(this.clvap);
    this.tipo      = '2';
/*    
    this.consultaTipoCte(this.tipo);
    this.tipo      = '5';
    this.consultaTipoCte(this.tipo);
*/    
    this.llenaAduanal();
    this.consultaDatosFactura();
    this.formafb();
    this.usuari    = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario    = this.usuari["idUsuario"];
    let empresaa   = this.usuari["idEmpresa"];
    let recintoo   = this.usuari["idRecinto"];
    this.usuario   = usuario;
    this.empresa   = empresaa;
    this.recinto   = recintoo;
    this.loading = true;
/*    
    this.obtenTC();
    this.consultaProdymat();
    this.catClientes();
    if (this.CteParamBol) {
      this.altafacturasal.controls['idCliProv'].setValue(this.CteParam);
      this.catPartCtee(this.CteParam);
    }
*/
  }

 
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

/*
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
  */


  formafb() {
    this.editfacturasal = this.fb.group({
      'idCliProv':         new FormControl(''),
      'empresa':           new FormControl(''),
      'recinto':           new FormControl(''),
      'listaallCte':       new FormControl(''),
      'numPedimentoSalida':new FormControl(''),
      'numFact':           new FormControl('',[Validators.required]),
      'indImpExpo':        new FormControl('',[Validators.required]),
      'pais':              new FormControl('',[Validators.required]),
      'tipCambio':         new FormControl('',[Validators.required]),
      'cLVPedi':           new FormControl('',[Validators.required]),
      'numPate':           new FormControl('',[Validators.required]),
      'aduana':            new FormControl('',[Validators.required]),
      'iNCOTERM':          new FormControl('',[Validators.required]),
      'nUMGuia':           new FormControl('',[Validators.required]),
      'transport':         new FormControl('',[Validators.required]),
      'nUMPlacaTr':        new FormControl('',[Validators.required]),
      'contCaja':          new FormControl('',[Validators.required]),
      'selloCand1':        new FormControl('',[Validators.required]),
      'selloCand2':        new FormControl('',[Validators.required]),
      'selloCand3':        new FormControl('',[Validators.required]),
      'NombChofTR':        new FormControl('',[Validators.required]),
      'po':                new FormControl('',[Validators.required]),
      'clieOrig':          new FormControl('',[Validators.required]),
      'clieDest':          new FormControl('',[Validators.required]),
      'producto':          new FormControl(''),
      'descEsp':           new FormControl('',[Validators.required]),
      'descIng':           new FormControl('',[Validators.required]),
      'cantidad':          new FormControl('',[Validators.required]),
      'uMC':               new FormControl('',[Validators.required]),
      'uMT':               new FormControl('',[Validators.required]),
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
                if (this.datawork.cr=="00"){
                    this.currentFacturas     = this.datawork.contenido;

                    this.editfacturasal.controls['idCliProv'         ].setValue(this.currentFacturas.idCliProv		      );
                    this.editfacturasal.controls['empresa'           ].setValue(this.currentFacturas.empresa            );
                    this.editfacturasal.controls['recinto'           ].setValue(this.currentFacturas.recinto            );
                    this.editfacturasal.controls['numPedimentoSalida'].setValue(this.currentFacturas.numPedimentoSalida );
                    this.editfacturasal.controls['numFact'           ].setValue(this.currentFacturas.numFact		        );
                    this.editfacturasal.controls['pais'              ].setValue(this.currentFacturas.paisFact           );
                    this.editfacturasal.controls['tipCambio'         ].setValue(this.currentFacturas.tipoCambio         );
                    this.editfacturasal.controls['cLVPedi'   				 ].setValue(this.currentFacturas.cLVPedi            );
                    this.editfacturasal.controls['numPate'   				 ].setValue(this.currentFacturas.numPate            );
                    this.editfacturasal.controls['aduana'    				 ].setValue(this.currentFacturas.aduana             );
                    this.editfacturasal.controls['iNCOTERM'  			   ].setValue(this.currentFacturas.iNCOTERM           );
                    this.editfacturasal.controls['nUMGuia'           ].setValue(this.currentFacturas.nUMGuia            );
                    this.editfacturasal.controls['transport' 				 ].setValue(this.currentFacturas.transport          );
                    this.editfacturasal.controls['nUMPlacaTr'        ].setValue(this.currentFacturas.nUMPlacaTr         );
                    this.editfacturasal.controls['contCaja'          ].setValue(this.currentFacturas.contCaja           );
                    this.editfacturasal.controls['selloCand1'        ].setValue(this.currentFacturas.selloCand1         );
                    this.editfacturasal.controls['selloCand2'        ].setValue(this.currentFacturas.selloCand2         );
                    this.editfacturasal.controls['selloCand3'        ].setValue(this.currentFacturas.selloCand3         );
                    this.editfacturasal.controls['NombChofTR'        ].setValue(this.currentFacturas.nombChofTr         );
                    this.editfacturasal.controls['po'                ].setValue(this.currentFacturas.pO                 );
                    this.editfacturasal.controls['clieOrig'  				 ].setValue(this.currentFacturas.clieOrig           );
                    this.editfacturasal.controls['clieDest'  				 ].setValue(this.currentFacturas.clieDest           );
                    this.editfacturasal.controls['producto'          ].setValue(this.currentFacturas.producto           );
//                    this.editfacturasal.controls['descIngles'        ].setValue(this.currentFacturas.descIngles         );
                    this.editfacturasal.controls['cantidad'          ].setValue(this.currentFacturas.cantidad           );
                    this.editfacturasal.controls['uMC'               ].setValue(this.currentFacturas.unidadDeMedida     );
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
//                    this.descIngles                = this.currentFacturas.descIngles        ;  
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

                    console.log("iDImpoEexpo")
                    console.log(this.iDImpoEexpo)
                    if(this.iDImpoEexpo == "1"){
                      this.iDImpoEexpo = "Importación"
                   }
                   if(this.iDImpoEexpo == "2"){
                      this.iDImpoEexpo = "Exportación"
                   }
                   this.pais   = this.paisFact;



                    if(this.iDImpoEexpo == '1'){
                       this.editfacturasal.controls['indImpExpo'].setValue('Importación');
                    }else if(this.iDImpoEexpo == '2'){
                       this.editfacturasal.controls['indImpExpo'].setValue('Exportación');
                    }                    
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


  enviar() {
    if (this.editfacturasal.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
  
        this.armausuario();
        console.log("editfacturasal.component.ts enviar currentFacturas")
        console.log(this.currentFacturas)

        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/aduanal';
        this.facturasService.editfactura(this.currentFacturas)
          .pipe(first())
          .subscribe(
              data => {
                this.dataworkedit = data;
                if (this.dataworkedit.cr=="00"){
                    this.msgokf();                    
                }
              },
              error => {
                this.alertService.error("Error al enviar el agente aduanal");
                this.loading = false;
              });    
    } //     Cierre del metodo enviar
  

    armausuario(){    
      this.currentFacturas.numFact = this.f.numPate.value;       

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


  traspaso(){

  }

  
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