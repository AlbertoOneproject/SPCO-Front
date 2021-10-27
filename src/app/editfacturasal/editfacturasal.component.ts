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
    this.consultaTipoCte(this.tipo);
    this.tipo      = '5';
    this.consultaTipoCte(this.tipo);
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


  formafb() {
    this.editfacturasal = this.fb.group({
      'idCliProv':           new FormControl('',[Validators.required]),
      'numPart':             new FormControl('',[Validators.required]),
      'numPedimentoEntrada': new FormControl('',[Validators.required]),       
      'numPedimentoSalida':  new FormControl(''),       
      'numFact':             new FormControl('',[Validators.required]),
      'gender':              new FormControl('',[Validators.required]),
      'fechaEntrada':        new FormControl('',[Validators.required]),
      'listaallpais':        new FormControl(''),
      'tipCambio':           new FormControl('',[Validators.required]),
      'listaallcLVPedi':     new FormControl(''),
      'listaallnumPate':     new FormControl(''),
      'listaalladuana':      new FormControl(''),
      'listaallincoterm':    new FormControl(''),
      'nUMGuia':             new FormControl('',[Validators.required]),
      'listaalltransport':   new FormControl(''),
      'nUMPlacaTr':          new FormControl('',[Validators.required]),
      'contCaja':            new FormControl('',[Validators.required]),
      'selloCand1':          new FormControl('',[Validators.required]),
      'selloCand2':          new FormControl('',[Validators.required]),
      'selloCand3':          new FormControl('',[Validators.required]),
      'NombChofTR':          new FormControl('',[Validators.required]),
      'po':                  new FormControl('',[Validators.required]),
      'listaallclieOrig':    new FormControl(''),
      'listaallclieDest':    new FormControl(''),
      'observaciones':       new FormControl('',[Validators.required])                 
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

                    this.editfacturasal.controls['idCliProv'           ].setValue(this.currentFacturas.idCliProv           );
                    this.editfacturasal.controls['numPart'             ].setValue(this.currentFacturas.idCliProv           );
                    this.editfacturasal.controls['numPedimentoEntrada' ].setValue(this.currentFacturas.numPedimentoEntrada );
                    this.editfacturasal.controls['numPedimentoSalida'  ].setValue(this.currentFacturas.numPedimentoSalida  );
                    this.editfacturasal.controls['numFact'             ].setValue(this.currentFacturas.numFact             );
                    this.editfacturasal.controls['fechaEntrada'        ].setValue(this.currentFacturas.fechaEntrada        );
                    this.editfacturasal.controls['tipCambio'           ].setValue(this.currentFacturas.tipoCambio          );                    
                    this.editfacturasal.controls['nUMGuia'             ].setValue(this.currentFacturas.nUMGuia             );
                    this.editfacturasal.controls['nUMPlacaTr'          ].setValue(this.currentFacturas.nUMPlacaTr          );
                    this.editfacturasal.controls['contCaja'            ].setValue(this.currentFacturas.contCaja            );
                    this.editfacturasal.controls['selloCand1'          ].setValue(this.currentFacturas.selloCand1          );
                    this.editfacturasal.controls['selloCand2'          ].setValue(this.currentFacturas.selloCand2          );
                    this.editfacturasal.controls['selloCand3'          ].setValue(this.currentFacturas.selloCand3          );
                    this.editfacturasal.controls['NombChofTR'          ].setValue(this.currentFacturas.nombChofTr          );
                    this.editfacturasal.controls['po'                  ].setValue(this.currentFacturas.pO                  );
                    this.editfacturasal.controls['observaciones'       ].setValue(this.currentFacturas.observaciones       );

                    this.idCliProv                = this.currentFacturas.idCliProv            ;
                    this.numPart                  = this.currentFacturas.numPart              ;
                    this.numFact                  = this.currentFacturas.numFact              ;
                    this.iDImpoEexpo              = this.currentFacturas.iDImpoEexpo          ;
                    this.fechaEntrada             = this.currentFacturas.fechaEntrada         ;
                    this.tipoCambio               = this.currentFacturas.tipoCambio           ;
                    this.paisFact                 = this.currentFacturas.paisFact             ;
                    this.numPedimentoEntrada      = this.currentFacturas.numPedimentoEntrada  ;
                    this.numPedimentoSalida       = this.currentFacturas.numPedimentoSalida   ;
                    this.cLVPedi                  = this.currentFacturas.cLVPedi              ;
                    this.numPate                  = this.currentFacturas.numPate              ;
                    this.aduana                   = this.currentFacturas.aduana               ;
                    this.producto                 = this.currentFacturas.producto             ;
                    this.cantidad                 = this.currentFacturas.cantidad             ;
                    this.costounitdls             = this.currentFacturas.costounitdls         ;
                    this.costoTotaldls            = this.currentFacturas.costoTotaldls        ;
                    this.costounitMXP             = this.currentFacturas.costounitMXP         ;
                    this.costototalMXP            = this.currentFacturas.costototalMXP        ;
                    this.unidadDeMedida           = this.currentFacturas.unidadDeMedida       ;
                    this.fraccAranc               = this.currentFacturas.fraccAranc           ;
                    this.netoOriginal             = this.currentFacturas.netoOriginal         ;
                    this.brutoOriginal            = this.currentFacturas.brutoOriginal        ;
                    this.netoConv                 = this.currentFacturas.netoConv             ;
                    this.brutoConv                = this.currentFacturas.brutoConv            ;
                    this.transport                = this.currentFacturas.transport.trim()     ;
                    this.clieOrig                 = this.currentFacturas.clieOrig.trim()      ;
                    this.clieDest                 = this.currentFacturas.clieDest.trim()      ;
                    this.iNCOTERM                 = this.currentFacturas.iNCOTERM             ;
                    this.nUMPlacaTr               = this.currentFacturas.nUMPlacaTr           ;
                    this.nUMGuia                  = this.currentFacturas.nUMGuia              ;
                    this.contCaja                 = this.currentFacturas.contCaja             ;
                    this.selloCand1               = this.currentFacturas.selloCand1           ;
                    this.selloCand2               = this.currentFacturas.selloCand2           ;
                    this.selloCand3               = this.currentFacturas.selloCand3           ;
                    this.nombChofTr               = this.currentFacturas.nombChofTr           ;
                    this.pO                       = this.currentFacturas.pO                   ;
                    this.empresa                  = this.currentFacturas.empresa              ;
                    this.recinto                  = this.currentFacturas.recinto              ;
                    this.observaciones            = this.currentFacturas.observaciones        ;
                    this.fechaAlta                = this.currentFacturas.fechaAlta            ;
                    this.fechaMod                 = this.currentFacturas.fechaMod             ;
                    this.hora                     = this.currentFacturas.hora                 ;
                    this.userMod                  = this.currentFacturas.userMod              ;
                    this.estatus                  = this.currentFacturas.estatus              ;         
                    this.entSal                   = this.currentFacturas.entSal               ;         

                    if(this.iDImpoEexpo == '1'){
                      this.editfacturasal.controls['gender'].setValue('1');
                    }else if(this.iDImpoEexpo == '2'){
                      this.editfacturasal.controls['gender'].setValue('2');
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
      this.currentFacturas = {
        idCliProv             : this.f.idCliProv.value          ,
        numPart							  : this.f.numPart.value            ,    
        numFact               : this.f.numFact.value            ,   
        iDImpoEexpo           : this.f.gender.value             , 
        fechaEntrada          : this.f.fechaEntrada.value       ,   
        paisFact              : this.f.listaallpais.value       ,   
        numPedimentoEntrada   : this.f.numPedimentoEntrada.value,   
        numPedimentoSalida    : this.f.numPedimentoSalida.value , 
        cLVPedi               : this.f.listaallcLVPedi.value    ,   
        numPate               : this.f.listaallnumPate.value    ,   
        aduana                : this.f.listaalladuana.value     ,   
        iNCOTERM              : this.f.listaallincoterm.value   ,   
        nUMPlacaTr            : this.f.nUMPlacaTr.value         ,   
        nUMGuia               : this.f.nUMGuia.value            ,   
        contCaja              : this.f.contCaja.value           ,   
        selloCand1            : this.f.selloCand1.value         ,   
        selloCand2            : this.f.selloCand2.value         ,   
        selloCand3            : this.f.selloCand3.value         ,   
        nombChofTr            : this.f.NombChofTR.value         ,   
        pO                    : this.f.po.value                 ,   
        observaciones         : this.f.observaciones.value      ,   

        tipoCambio            : this.currentFacturas.tipoCambio         , 
        producto              : this.currentFacturas.producto           , 
        cantidad              : this.currentFacturas.cantidad           , 
        costounitdls          : this.currentFacturas.costounitdls       , 
        costoTotaldls         : this.currentFacturas.costoTotaldls      , 
        costounitMXP          : this.currentFacturas.costounitMXP       , 
        costototalMXP         : this.currentFacturas.costototalMXP      , 
        unidadDeMedida        : this.currentFacturas.unidadDeMedida     , 
        fraccAranc            : this.currentFacturas.fraccAranc         ,
        netoOriginal          : this.currentFacturas.netoOriginal       ,
        brutoOriginal         : this.currentFacturas.brutoOriginal      ,
        netoConv              : this.currentFacturas.netoConv           ,
        brutoConv             : this.currentFacturas.brutoConv          ,
        empresa               : this.currentFacturas.empresa            ,
        recinto               : this.currentFacturas.recinto            ,
        fechaAlta             : this.currentFacturas.fechaAlta          ,
        fechaMod              : this.currentFacturas.fechaMod           ,
        hora                  : this.currentFacturas.hora               ,
        userMod               : this.currentFacturas.userMod            ,
        estatus               : this.estatus                            ,
        entSal                : this.entSal                             ,

        clieOrig              : this.f.listaallclieOrig.value           ,
        clieDest              : this.f.listaallclieDest.value           ,
        transport             : this.f.listaalltransport.value          ,
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