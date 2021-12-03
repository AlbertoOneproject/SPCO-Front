import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, PartesService, FacturasService, CteyprovService,SysdtapeService, AduanalService, ProdymatService } from './../service';
import { Facturas,Partes, Sysdtape, Login, Prodymat } from '../model'
import { first } from 'rxjs/operators';
import { MsgokfComponent } from './../msgokf/msgokf.component'
import { MatDialog} from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-altafacturasal',
  templateUrl: './altafacturasal.component.html',
  styleUrls: ['./altafacturasal.component.css']
})
export class AltafacturasalComponent implements OnInit {
  dataPais      : Sysdtape
  dataProd      : Prodymat;
  dataExist     : any[]=[];
  datadesMC     : any[];
  datadesMT     : any[];
  datafact      : any[];
  dataworkprod  : any=[];
  MonManda      : boolean=false;
  ConDescr      : boolean=false;
  dataCli       : any[]=[];
  dataPart      : any[]=[];
  datacLVPedi   : any[]=[];
  datanumPate   : any[]=[];
  dataaduana    : any[]=[];
  dataincoterm  : any[]=[];
  datatransport : any[]=[];
  dataclieOrig  : any[]=[];
  dataclieDest  : any[]=[];
  dataPedimento : any[]=[];
  datawork      : any=[];
  clvap         : string;
  tipo          : string;
  altafacturasal: FormGroup;
  msg           = '';
  CteSel        : string;
  usuari        : Login
  usuario       : string;
  empresa       : string;
  recinto       : string;
  loading       = false;
  returnUrl     : string;
  currentPartes : Partes;
  currentFacturas : Facturas;
  orders        = [];
  factor        : number;
  nico          : string;
  uMC           : string;
  uMT           : string;
  numPedimentoSalida: string = "";
  opc           : string = '0';
  estatus       : string = "T";
  entSal        : string = "S";
  CteParam      : string = "";
  CteParamBol   : boolean = false;
  totalExist    : number=0;


  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private consprod                : ProdymatService,
    private consape                 : SysdtapeService,
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
    if (this.route.snapshot.paramMap.get('cliente') != "0"  ){
      this.CteParam = this.route.snapshot.paramMap.get('cliente');
      this.CteParamBol = true;
    }else{
      this.CteParamBol = false;
      this.CteParam = '0';
    }
  }


  ngOnInit(): void {
    this.consultaProdymat();
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
    if (this.CteParamBol) {
      this.altafacturasal.controls['idCliProv'].setValue(this.CteParam);
      this.catPartCtee(this.CteParam);
  }
    this.usuari    = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario    = this.usuari["idUsuario"];
    let empresa    = this.usuari["idEmpresa"];
    let recinto    = this.usuari["idRecinto"];
    this.usuario   = usuario;
    this.empresa   = empresa;
    this.recinto   = recinto;
    this.altafacturasal.controls['empresa'].setValue(this.empresa);
    this.altafacturasal.controls['recinto'].setValue(this.recinto);


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
        this.altafacturasal = this.fb.group({
          'idCliProv':         new FormControl(''),
          'empresa':           new FormControl(''),
          'recinto':           new FormControl(''),
          'listaallCte':       new FormControl(''),
          'listaallPartes':    new FormControl('',[Validators.required]),
          'listaallPedimento': new FormControl('',[Validators.required]),       
          'numPedimentoSalida':new FormControl(''),
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
          'producto':          new FormControl(''),
          'listaallprod':      new FormControl('',[Validators.required]),
          'descIngles':        new FormControl('',[Validators.required]),
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

  consultaProdymat(){    
    this.consprod.prodymatTodos(this.opc)
    .pipe(first())
    .subscribe(
        data => {
            this.dataworkprod = data;
            if (this.dataworkprod.cr=="00"){
                console.log("altafacturasal.component consultaProdymat dataworkprod data/dataworkprod")
                console.log(data)
                console.log(this.dataworkprod)
                this.dataProd    = this.dataworkprod.contenido.sysCatProductos;
                this.datadesMC   = this.dataworkprod.contenido.lDescripUMC
                this.datadesMT   = this.dataworkprod.contenido.lDescripuMT
                this.datafact    = this.dataworkprod.contenido.lFactor
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

  cambExist(cant: any){
    console.log("cambExist")
    console.log(cant)
    console.log(cant.target.value)
    console.log(this.totalExist)
    if (cant.target.value > this.totalExist){
      this.alertService.error("Error la cantidad no puede ser mayor a " + this.totalExist);
      this.loading = false;
    }else{
      if (this.dataworkprod.contenido.sysCatProductos[this.f.listaallprod.value].monedaMandataria == 'MXP'){
        console.log("PESOS")
        this.TotalMXP()
      }else{
        console.log("DOLARES")
        this.TotalUSD()
      }        
    }

  } // Cierre del método cambExist

  cambio(id1: any){
    this.altafacturasal.controls['uMC'].setValue(this.dataworkprod.contenido.lDescripUMC[id1.target.value]);
    this.altafacturasal.controls['uMT'].setValue(this.dataworkprod.contenido.lDescripUMT[id1.target.value]);
    this.altafacturasal.controls['producto'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);
    this.altafacturasal.controls['descIngles'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].descCorIng);
    this.altafacturasal.controls['fraccAranc'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].fraccAranc);
    this.factor = this.dataworkprod.contenido.lFactor[id1.target.value]

    this.nico        = this.dataworkprod.contenido.sysCatProductos[id1.target.value].nico
    this.uMC         = this.dataworkprod.contenido.sysCatProductos[id1.target.value].uMC
    this.uMT         = this.dataworkprod.contenido.sysCatProductos[id1.target.value].uMT

    this.ConDescr = true;

    let cliente   : string;
    if (this.CteParamBol){
        cliente   = this.f.idCliProv.value;  
    }else{
        cliente   = this.f.listaallCte.value; 
    }
    this.obtenExistencia(cliente, this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);
  
    if (this.dataworkprod.contenido.sysCatProductos[id1.target.value].monedaMandataria == 'MXP'){
        this.MonManda = true;

        this.altafacturasal.controls['costoUnitMXP'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitMXP);
        let CUnitUSD = this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitMXP / this.f.tipCambio.value ;
        this.altafacturasal.controls['costoUnitDLS'].setValue(CUnitUSD);

        let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
        let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
        this.altafacturasal.controls['costototalMXP'].setValue(CTotalMxp);
        this.altafacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
    }

    if (this.dataworkprod.contenido.sysCatProductos[id1.target.value].monedaMandataria == 'USD'){
      this.MonManda = false;

      this.altafacturasal.controls['costoUnitDLS'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitDLS);
      let CUnitMXP = this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitDLS * this.f.tipCambio.value ;
      this.altafacturasal.controls['costoUnitMXP'].setValue(CUnitMXP);

      let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
      let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
      this.altafacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
      this.altafacturasal.controls['costototalMXP'].setValue(CTotalMxp);
    }
  }    // Cierre del método cambio


  TotalMXP(){
    let CUnitUSD = this.f.costoUnitMXP.value / this.f.tipCambio.value ;
    this.altafacturasal.controls['costoUnitDLS'].setValue(CUnitUSD);

    let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
    let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
    this.altafacturasal.controls['costototalMXP'].setValue(CTotalMxp);
    this.altafacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
  }


  TotalUSD(){
    let CUnitMXP = this.f.costoUnitDLS.value * this.f.tipCambio.value ;
    this.altafacturasal.controls['costoUnitMXP'].setValue(CUnitMXP);

    let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
    let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
    this.altafacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
    this.altafacturasal.controls['costototalMXP'].setValue(CTotalMxp);
  }


  netoConvertido(){
    console.log("factor")
    console.log(this.factor)
    let NetoConv     = this.factor * this.f.netoOriginal.value
    this.altafacturasal.controls['netoConv'].setValue(NetoConv);
  }    // Cierre del método netoConvertido


  brutoConvertido(){
    console.log("factor")
    console.log(this.factor)
    let BrutoConv    = this.factor * this.f.brutoOriginal.value
    this.altafacturasal.controls['brutoConv'].setValue(BrutoConv);
  }    // Cierre del método brutoConvertido


  obtenExistencia(idCliProv, producto){
    this.totalExist   = 0;
    console.log("obtenCantdidad parráfo")
    console.log(idCliProv);
    console.log(producto)
    this.facturasService.obtenExistencia(idCliProv, producto)
    .pipe(first())
    .subscribe(
      data => {
        this.dataExist = data.contenido
        console.log("obten Cantidad data contenido dataExist ")   
        console.log(this.dataExist)
          if (data.cr=="00"){
              console.log("obtenExistencia CR = 0")
              let listExist = [];
              this.dataExist.forEach(item =>{
                listExist.push({"idCliProv": item[0],"NumPart": item[1],"NumPedEnt": item[2],"FecEnt": item[3],"Producto": item[4],"idImpExp": item[5],"Existencia": item[6]});
                this.totalExist = this.totalExist + item[6]
                console.log(listExist)
                console.log(this.totalExist)
             });
             this.altafacturasal.controls['cantidad'].setValue(this.totalExist);
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
    this.catPartCtee(id1.target.value);
  }  


  catPartCtee(Cte: string){
    this.CteSel  = Cte;
    this.partesService.catPartCte(Cte)
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
          this.altafacturasal.controls['fechaEntrada'].setValue(this.dataPedimento[i].fechaEntrada);
          this.altafacturasal.controls['tipCambio'   ].setValue(this.dataPedimento[i].tipCambio);
      }
    }
  } // Cierre del método completarPartes


  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/facturasal';
    this.router.navigate([this.returnUrl]);   
  }    // Cierre del método cancelar


// convenience getter for easy access to form fields
    get f() { return this.altafacturasal.controls; }


  enviar() {   
    if (this.altafacturasal.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }    
    
        this.armausuario();
        console.log(this.currentFacturas)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/facturasal';
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
                      this.alertService.error("Error en el Alta de Aduana Facturasl Salida");
                      this.loading = false;
                    }
                });       
        return   
    } // Cierre del método enviar


  armausuario(){
      this.currentFacturas = {
          idCliProv             : this.f.listaallCte.value       ,
          numPart							  : this.f.listaallPartes.value    ,    
          numFact               : this.f.numFact.value           ,   
          iDImpoEexpo           : this.f.orders.value            ,   
          fechaEntrada          : this.f.fechaEntrada.value      ,   
          paisFact              : this.f.listaallpais.value      ,   
          numPedimentoEntrada   : this.f.listaallPedimento.value ,   
          numPedimentoSalida    : this.f.numPedimentoSalida.value, 
          cLVPedi               : this.f.listaallcLVPedi.value   ,   
          numPate               : this.f.listaallnumPate.value   ,   
          aduana                : this.f.listaalladuana.value    ,   
          transport             : this.f.listaalltransport.value ,   
          clieOrig              : this.f.listaallclieOrig.value  ,   
          clieDest              : this.f.listaallclieDest.value  ,   
          iNCOTERM              : this.f.listaallincoterm.value  ,   
          nUMPlacaTr            : this.f.nUMPlacaTr.value        ,   
          nUMGuia               : this.f.nUMGuia.value           ,   
          contCaja              : this.f.contCaja.value          ,   
          selloCand1            : this.f.selloCand1.value        ,   
          selloCand2            : this.f.selloCand2.value        ,   
          selloCand3            : this.f.selloCand3.value        ,   
          nombChofTr            : this.f.NombChofTR.value        ,   
          pO                    : this.f.po.value                ,   
          observaciones         : this.f.observaciones.value     ,   

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
          entSal                : this.entSal                           , 
     }    
     if ( this.CteParamBol ){
      this.currentFacturas.idCliProv =  this.CteParam; 
     }
     if (this.numPedimentoSalida == ""){
         this.numPedimentoSalida = "0";
     }
  }     // Cierre del metodo armausuario

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
  }


} //Cierre principal
