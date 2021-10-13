import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, PartesService, FacturasService, CteyprovService,SysdtapeService, ProdymatService, AduanalService } from './../service';
import { Facturas,Partes, Prodymat, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokfComponent } from './../msgokf/msgokf.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-altafacturas',
  templateUrl: './altafacturas.component.html',
  styleUrls: ['./altafacturas.component.css']
})
export class AltafacturasComponent implements OnInit {
  CurrentDate   = new Date();
  curr          = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1         = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  dataPais      : Sysdtape
  dataProd      : Prodymat;
  dataCli       : any[]=[];
  dataPart      : any[]=[];
  datadesMC     : any[]=[];
  datadesMT     : any[]=[];
  datafact      : any[]=[];
  datacLVPedi   : any[]=[];
  datanumPate   : any[]=[];
  dataaduana    : any[]=[];
  dataincoterm  : any[]=[];
  datatransport : any[]=[];
  dataclieOrig  : any[]=[];
  dataclieDest  : any[]=[];
  dataPedimento : any[]=[];
  dataworkprod  : any=[];
  datawork      : any=[];
  factor        : number;
  opc           : string = '0';
  MonManda      : boolean=false;
  clvap         : string;
  tipo          : string;
  altafacturas  : FormGroup;
  msg           = '';
  CteSel        : string;
  usuari        : Login
  usuario       : string;
  empresa       : string;
  recinto       : string;
  nico          : string;
  uMC           : string;
  uMT           : string;
  loading       = false;
  returnUrl     : string;
  currentPartes : Partes;
  currentFacturas : Facturas;
  orders        = [];
  numPedimentoSalida: string = "";
  estatus       : string = "T";


  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private consape                 : SysdtapeService,
    private consprod                : ProdymatService,
    private conscte                 : CteyprovService,
    private fb                      : FormBuilder,
    private partesService           : PartesService, 
    private facturasService         : FacturasService, 
    private aduanalService          : AduanalService,
    private alertService            : AlertService,
    private route                   : ActivatedRoute,
    private router                  : Router,
    private dialog                  : MatDialog,
  ) { 
    this.orders = this.getOrders();
  }


  ngOnInit(): void {
    this.catClientes();
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
    this.formafb();
    this.llenaAduanal();
    this.usuari    = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario    = this.usuari["idUsuario"];
    let empresa    = this.usuari["idEmpresa"];
    let recinto    = this.usuari["idRecinto"];
    this.usuario   = usuario;
    this.empresa   = empresa;
    this.recinto   = recinto;

    //let userMod = this.usuari["idUsuario"];
  } // Cierre del método ngOnInit

  getOrders() {
    return [
      { id: "1", name: "Importación" },
      { id: "2", name: "Exportación" }
    ];
  }

  catClientes(){
    this.partesService.catClientes()
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.dataCli = data.contenido;
             console.log("CAT CLIENTES")
             console.log(this.dataCli)
             this.f.listaallCte.patchValue(this.dataCli);
        }},
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Clientes");              
          this.loading = false;
        });
  } // Cierre del método catClientes
  
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
            this.alertService.error("Error en la Consulta");
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
                this.f.listaallclieOrig.patchValue(this.dataclieOrig);
                this.f.listaallclieDest.patchValue(this.dataclieDest);
              }
              if (tipo =='5'){
                this.datatransport   = this.datawork.contenido;
                this.f.listaalltransport.patchValue(this.datatransport);
              }
            }else {
                this.datawork.descripcion
                this.alertService.error("Error al obtener información Error: "+ this.datawork.descripcion + " " + tipo);
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en la Consulta");
            this.loading = false;
        });
  } // Cierre del método consultaTipoCte 


  formafb() {
        this.altafacturas = this.fb.group({
          'listaallCte':       new FormControl('',[Validators.required]),
          'listaallPartes':    new FormControl('',[Validators.required]),
          'listaallPedimento': new FormControl('',[Validators.required]),       
          'numFact':           new FormControl('',[Validators.required]),
          'orders':            new FormControl('',[Validators.required]),
          'fechaEntrada':      new FormControl('',[Validators.required]),
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
          'observaciones':     new FormControl('',[Validators.required])
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
            this.alertService.error("No hay conexión con la Base de Datos");
            this.loading = false;
        });
  }  // Cierre del método llenaAduanal
  

  catPartCte(id1: any){
    console.log("catPartsinCte  id1")
    console.log(id1.target.value)
    this.CteSel  = id1.target.value;
    this.partesService.catPartCte(id1.target.value)
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.dataPart = data.contenido;
             console.log("dataPart")
             console.log(this.dataPart)
//             this.f.listaallPartes.patchValue(this.dataPart);
          }
        },
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Partes");              
          this.loading = false;
        });
  } // Cierre del método catPartsinCte


  obtenPedimento(id1: any){
    console.log("obtenPedimento  id1")
    console.log(id1.target)
    console.log(id1.target.value)
    console.log(this.CteSel)
    this.partesService.catPartes(this.CteSel,id1.target.value)
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.dataPedimento = data.contenido;
             console.log("dataPart")
             console.log(this.dataPart)
//             this.f.listaallPartes.patchValue(this.dataPart);
          }
        },
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Partes");              
          this.loading = false;
        });

  } // Cierre del método obtenPedimento


  completarPartes(id1: any){
    for (let i=0; i < this.dataPedimento.length; i++){
      if (this.dataPedimento[i].numPedimento == id1.target.value){
           this.currentPartes = this.dataPedimento[i];
          this.altafacturas.controls['fechaEntrada'].setValue(this.dataPedimento[i].fechaEntrada);
          this.altafacturas.controls['tipCambio'   ].setValue(this.dataPedimento[i].tipCambio);
      }
    }
  } // Cierre del método completarPartes


  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/facturas';
    this.router.navigate([this.returnUrl]);   
  }    // Cierre del método cancelar


// convenience getter for easy access to form fields
    get f() { return this.altafacturas.controls; }


  enviar() {   

/*
    if (this.altafacturas.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }    
*/    
        this.armausuario();
        console.log(this.currentFacturas)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/partes';
        this.facturasService.altafacturas(this.currentFacturas)
            .pipe(first())
            .subscribe(
                data => {
                    this.datawork = data;
                    if (this.datawork.cr=="00"){
                        this.msgokf();
                    }else{
                        this.loading = false;
                        this.msg     = this.datawork.descripcion;
                        this.alertService.error(this.msg);
                    }
                    error => {
                      this.alertService.error("Error en el Alta de Aduana Partes");
                      this.loading = false;
                    }
                });       
        return   
    } // Cierre del método enviar


  armausuario(){
      this.currentFacturas = {
          idCliProv             : this.f.listaallCte.value      ,
          numPart							  : this.f.listaallPartes.value   ,    
          numFact               : this.f.numFact.value          ,   
          iDImpoEexpo           : this.f.orders.value           ,   
          fechaEntrada          : this.f.fechaEntrada.value     ,   
          paisFact              : this.f.listaallpais.value     ,   
          numPedimentoEntrada   : this.f.listaallPedimento.value,   
          cLVPedi               : this.f.listaallcLVPedi.value  ,   
//          numPate               : this.f.listaallnumPate.value  ,   
          numPate               : "7777"  ,   
          aduana                : this.f.listaalladuana.value   ,   
          transport             : this.f.listaalltransport.value,   
          clieOrig              : this.f.listaallclieOrig.value ,   
          clieDest              : this.f.listaallclieDest.value ,   
          iNCOTERM              : this.f.listaallincoterm.value ,   
          nUMPlacaTr            : this.f.nUMPlacaTr.value       ,   
          nUMGuia               : this.f.nUMGuia.value          ,   
          contCaja              : this.f.contCaja.value         ,   
          selloCand1            : this.f.selloCand1.value       ,   
          selloCand2            : this.f.selloCand2.value       ,   
          selloCand3            : this.f.selloCand3.value       ,   
          nombChofTr            : this.f.NombChofTR.value       ,   
          pO                    : this.f.po.value               ,   
          observaciones         : this.f.observaciones.value    ,   

          numPedimentoSalida    : this.numPedimentoSalida               , 
          tipoCambio            : this.currentPartes.tipCambio          , 
          producto              : this.currentPartes.producto           , 
          cantidad              : this.currentPartes.cantidad           , 
          costounitdls          : this.currentPartes.costounitdls       , 
          costoTotaldls         : this.currentPartes.costoTotaldls      , 
          costounitMXP          : this.currentPartes.costounitMXP       , 
          costototalMXP         : this.currentPartes.costototalMXP      , 
          unidadDeMedida        : this.currentPartes.uMC                , 
          fraccAranc            : this.currentPartes.fraccAranc         , 
          netoOriginal          : this.currentPartes.netoOriginal       , 
          brutoOriginal         : this.currentPartes.brutoOriginal      , 
          netoConv              : this.currentPartes.netoConv           , 
          brutoConv             : this.currentPartes.brutoConv          , 
          empresa               : this.currentPartes.empresa            , 
          recinto               : this.currentPartes.recinto            , 
          fechaAlta             : this.currentPartes.fechaAlta          , 
          fechaMod              : this.currentPartes.fechaMod           , 
          hora                  : this.currentPartes.hora               , 
          userMod               : this.currentPartes.userMod            , 
          estatus               : this.estatus                          , 


     }    
  }     // Cierre del metodo armausuario


  msgokf(): void {
    const dialogRef = this.dialog.open(MsgokfComponent, {
      width: '400px',
      height: '200px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }


} //Cierre principal
