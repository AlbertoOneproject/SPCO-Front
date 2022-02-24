import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, PartesService, FacturasService, CteyprovService,SysdtapeService, AduanalService, ProdymatService, ShareService } from './../service';
import { Facturas,Partes, Sysdtape, Login, Prodymat } from '../model'
import { first } from 'rxjs/operators';
import { MsgokfComponent } from './../msgokf/msgokf.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-altafacturasal',
  templateUrl: './altafacturasal.component.html',
  styleUrls: ['./altafacturasal.component.css']
})
export class AltafacturasalComponent implements OnInit {
  CurrentDate   = new Date();
  curr          = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1         = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  dataTC        : string;
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
  estatus       : string = "G";
  entSal        : string = "S";
  CteParam      : string = "";
  consParm      : string = 'F';
  CteParamBol   : boolean = false;
  totalExist    : number =0;
  contExist     : number = 0;
  listExist     : any[]=[];
  cantSdo       : number = 0;
  cantDisp      : number = 0;
  cantCont      : number = 0;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private consprod                : ProdymatService,
    private shareService            : ShareService,
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
    this.loading = true;
    this.obtenTC();
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

  
  obtenTC(){
    this.shareService.tipoCambio()
    .pipe(first())
    .subscribe(
        data => {
          if (data.bmx.series[0].idSerie ==  "SF43718"){          
             this.dataTC  = data.bmx.series[0].datos[0].dato;
             this.altafacturasal.controls['tipCambio'   ].setValue(this.dataTC);
             this.loading = true;
        }},
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Clientes");              
          this.loading = false;
        });
  } // Cierre del método obtenTC


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


  cambio(id1: any){
    console.log("cambio dataworkprod")
    console.log(this.dataworkprod.contenido[id1.target.value])
    console.log(this.dataworkprod.contenido.sysCatProductos[id1.target.value])

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
    
    if (this.CteParamBol){
        cliente   = this.f.idCliProv.value; 
        console.log("cliente param"+ cliente) 
       }else{
        cliente   = this.f.listaallCte.value; 
        console.log("cliente sin param"+ cliente) 
       }
    this.obtenExistencia(cliente, this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);
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
    this.contExist    = 0;
    this.listExist    = [];
    console.log("obtenCantdidad parráfo")
    console.log(idCliProv);
    console.log(producto)
    this.facturasService.obtenExistencia(idCliProv, producto, this.consParm)
    .pipe(first())
    .subscribe(
      data => {
        this.dataExist = data.contenido
        console.log("obten Cantidad data contenido dataExist ")   
        console.log(this.dataExist)
          if (data.cr=="00"){
              console.log("obtenExistencia CR = 0")

              this.dataExist.forEach(item =>{
                this.listExist.push({
                      "idCliProv"  : item[0],
                      "NumPart"    : item[1],
                      "NumPedEnt"  : item[2],
                      "FecEnt"     : item[3],
                      "Producto"   : item[4],
                      "idImpExp"   : item[5],
                      "NumFact"    : item[6],
                      "Existencia" : item[7]});
                this.totalExist = this.totalExist + item[7]
                this.contExist  = this.contExist + 1
                console.log(" FOREACH ==> ")
                console.log(this.listExist)
                console.log(this.totalExist)
             });
             if (this.totalExist == 0){
              console.log("ENTRE A BORRAR LOS CAMPOS POR SER CERO")
              this.altafacturasal.controls['uMC'].setValue("");
              this.altafacturasal.controls['uMT'].setValue("");
              this.altafacturasal.controls['producto'].setValue("");
              this.altafacturasal.controls['descIngles'].setValue("");
              this.altafacturasal.controls['fraccAranc'].setValue("");
              this.altafacturasal.controls['costoUnitMXP'].setValue(0);
              this.altafacturasal.controls['costoUnitDLS'].setValue(0);
            }
             this.altafacturasal.controls['cantidad'].setValue(this.totalExist);
             let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
             let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
             this.altafacturasal.controls['costototalMXP'].setValue(CTotalMxp);
             this.altafacturasal.controls['costoTotaldls'].setValue(CTotalDLS);
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

  
/*
  completarPartes(id1: any){
    for (let i=0; i < this.dataPedimento.length; i++){
      if (this.dataPedimento[i].numPedimento == id1.target.value){
           this.currentPartes = this.dataPedimento[i];
          this.altafacturasal.controls['fechaEntrada'].setValue(this.dataPedimento[i].fechaEntrada);
          this.altafacturasal.controls['tipCambio'   ].setValue(this.dataPedimento[i].tipCambio);
      }
    }
  } // Cierre del método completarPartes
*/

  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/facturasal';
    this.router.navigate([this.returnUrl]);   
  }    // Cierre del método cancelar


// convenience getter for easy access to form fields
    get f() { return this.altafacturasal.controls; }

    
  guardar() {
    console.log("Guardar")
    console.log(this.totalExist)
    console.log(this.contExist)
    console.log(this.f.cantidad.value)

    this.cantSdo = 0;   
    this.cantCont = 0;
    this.cantSdo = this.f.cantidad.value;   
    if (this.altafacturasal.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }  
//    this.totalExist = this.totalExist + item[7]
//    this.contExist  = this.contExist + 1
/*    if (this.f.cantidad.value  == this.totalExist){
      this.cantDisp                  = this.listExist[i].Existencia;
      this.cantSdo                   = this.cantSdo - this.cantDisp;
      this.currentFacturas.cantidad  = this.cantDisp;
      console.log("Saldo")
      console.log(this.cantSdo)
    }else{
*/      
    if (this.f.cantidad.value <= this.totalExist){
      for (let y=0; y < this.contExist; y++){ 
        if (this.cantSdo > 0){
          console.log("dentro de Y ")
          console.log(y)
          console.log(this.cantCont)
          this.cantCont = this.cantCont + 1;
          this.cantSdo  =  this.cantSdo - this.listExist[y].Existencia
          console.log("Despues ")
          console.log(this.cantCont)
        }
      }
    }

    console.log("VOY AL FOR ")
    console.log(this.cantCont)
    this.cantSdo = this.f.cantidad.value; 
    for (let i=0; i < this.cantCont; i++){ 
        console.log("guardar for ")
        console.log(i)
        console.log(this.cantSdo)
        this.armausuario(i);
        if (this.cantSdo >= this.listExist[i].Existencia){
             console.log("dentro del if ")
             console.log(this.cantSdo)
            this.currentFacturas.cantidad = this.listExist[i].Existencia
            this.cantSdo  =  this.cantSdo - this.listExist[i].Existencia
        }else{
            console.log("dentro del if 2")
            console.log(this.cantSdo)
            this.currentFacturas.cantidad        = this.cantSdo
        }
        console.log(" guardar currentFacturas ==> ")        
        console.log(this.currentFacturas)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/facturasal';
        this.facturasService.altafacturas(this.currentFacturas)
            .pipe(first())
            .subscribe(
                data => {
                    this.datawork = data;
                    console.log(" datawork ===>  ")
                    console.log(this.datawork)
                    console.log(i)
                    console.log(this.cantCont)
                    if (this.datawork.cr == "00"){
                        if (i+1 == this.cantCont ){
                            this.msgokf();
                        }
                    }else{
                        this.loading   = false;
                        this.msg       = this.datawork.descripcion;
                        this.alertService.error(this.msg);
                    }
                    error => {
                      this.alertService.error("Error en el Alta de Aduana Facturasl Salida");
                      this.loading = false;
                    }
                });       
      }
      return   
    } // Cierre del método guardar


  armausuario(i){
      this.currentFacturas = {
          idCliProv             : this.f.listaallCte.value              ,
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

     if ( this.CteParamBol ){
      this.currentFacturas.idCliProv =  this.CteParam; 
     }

     if (this.numPedimentoSalida == ""){
         this.numPedimentoSalida = "0";
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
