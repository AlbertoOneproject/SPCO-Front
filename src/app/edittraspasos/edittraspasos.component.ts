import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, PartesService, FacturasService, ProdymatService, ShareService, TraspasosService } from './../service';
import { Login, Prodymat, Traspasos } from '../model'
import { first } from 'rxjs/operators';
import { MsgokfComponent } from './../msgokf/msgokf.component'
import { MsgoktrComponent } from './../msgoktr/msgoktr.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-edittraspasos',
  templateUrl: './edittraspasos.component.html',
  styleUrls: ['./edittraspasos.component.css']
})
export class EdittraspasosComponent implements OnInit {
  CurrentDate         = new Date();
  curr                = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1               = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  dataProd            : Prodymat;
  dataExist           : any[]=[];
  dataTrasp           : any[];
  dataworkprod        : any=[];
  dataCli             : any[]=[];
  dataRecin           : any[]=[];
  dataPart            : any[]=[];
  dataFact            : any[]=[];
  dataPedimento       : any[]=[];
  datawork            : any=[];
  edittraspasos       : FormGroup;
  msg                 = '';
  CteSel              : string;
  usuari              : Login
  usuario             : string;
  loading             = false;
  returnUrl           : string;
  currentTrasp        : Traspasos;
  opc                 : string = '0';
  estatus             : string = "G";
  entSal              : string = "S";
  consParm            : string = 'T';
  CteParam            : string = "";
  CteParamBol         : boolean = false;
  totalExist          : number =0;
  totalConsu          : number =0;
  totalTrasp          : number =0;
  contExist           : number = 0;
  listExist           : any[]=[];

  empresa             : string;
  recinto             : string;
  idCliProv 	        : string;
  recintoDest         : string;
  idCliProvDest       : string;
  numPart		    	    : string;
  numFact             : string;
  numPedimentoEntrada : string;
  //estatus             : string;
  producto            : string;
  cantidad            : string;
  fechaAlta           : string;
  fechaMod            : string;
  hora                : string;
  userMod             : string;
  //entSal              : string;
  numFactEnt          : string;
  descrProd           : string;

  bandDelete        : boolean = false;
  bandDelReg        : string;

  constructor(
  @Inject(LOCALE_ID) public locale : string,
  private consprod                : ProdymatService,
  private shareService            : ShareService,
  private fb                      : FormBuilder,
  private partesService           : PartesService, 
  private facturasService         : FacturasService, 
  private traspasosService        : TraspasosService,
  private alertService            : AlertService,
  private route                   : ActivatedRoute,
  private router                  : Router,
  private dialog                  : MatDialog,

) {}
   
ngOnInit(): void {
  this.loading = true;
  this.catClientes();
  this.catRecintos();
  this.consultaProdymat(); 
  this.formafb();
  this.consultaDatosFactura();

  this.usuari    = JSON.parse(localStorage.getItem('currentUserLog'));
  let usuario    = this.usuari["idUsuario"];
  let empresa    = this.usuari["idEmpresa"];
  this.usuario   = usuario;
  this.empresa   = empresa;
  this.edittraspasos.controls['empresa'].setValue(this.empresa);

} // Cierre del método ngOnInit


// Obtiene el catálogo de clientes  
catClientes(){
  this.partesService.catClientes()
  .pipe(first())
  .subscribe(
      data => {
        if (data.cr=="00"){          
            this.dataCli     = data.contenido;
            console.log("dataCli ==> ")
            console.log(this.dataCli)
            this.edittraspasos.controls['listaallCteO'].setValue(this.dataCli);
            this.edittraspasos.controls['listaallCteD'].setValue(this.dataCli);
       }},
      error => {
        this.alertService.error("Error en la consulta del Catálogo de Clientes");              
        this.loading = false;
      });
} // Cierre del método catClientes


//Obtiene los recintos 
catRecintos(){
  this.shareService.recintos()
  .pipe(first())
  .subscribe(
      data => {
        if (data.cr=="00"){          
           this.dataRecin = data.contenido;         
      }},
      error => {
        this.alertService.error("Error en la consulta del Catálogo de Recintos");              
        this.loading = false;
      });
} // Cierre del método catClientes


// Obtiene Producto y Tipo de Materiales
consultaProdymat(){    
  this.consprod.prodymatTodos(this.opc)
  .pipe(first())
  .subscribe(
      data => {
          this.dataworkprod = data;
          if (this.dataworkprod.cr =="00"){
              this.dataProd    = this.dataworkprod.contenido.sysCatProductos;
//              this.edittraspasos.controls['listaallprod'      ].setValue(this.dataProd);
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


formafb() {
  this.edittraspasos = this.fb.group({
    'idCliProvO':         new FormControl(''),
    'empresa':            new FormControl('',[Validators.required]),
    'listaallCteO':       new FormControl('',[Validators.required]),
    'listaallCteD':       new FormControl('',[Validators.required]),
    'recintoOrig':        new FormControl(''),
    'listaallRecO':       new FormControl('',[Validators.required]),
    'listaallRecD':       new FormControl('',[Validators.required]),
    'listaallPartes':     new FormControl('',[Validators.required]),
    'listaallPedimento':  new FormControl('',[Validators.required]),
    'listaallFac':        new FormControl('',[Validators.required]),
    'producto':           new FormControl('',[Validators.required]),
    'listaallprod':       new FormControl('',[Validators.required]),
    'cantidad':           new FormControl('',[Validators.required])
}); 
} // Cierre del método formafb


consultaDatosFactura(){
  this.route.params.subscribe( params =>{ 
      this.traspasosService.viewTraspasoDesc(params['idCliProv'],params['numPart'],params['numFact'], params['numPedi'])  
      .pipe(first())
      .subscribe( 
          data => {
              this.datawork = data;
              console.log(" data consultaDatosTraspaso    ")
              console.log(this.datawork)
              if (this.datawork.cr  ==  "00"){
                  this.currentTrasp                        = this.datawork.contenido              ;
                  this.descrProd                           = this.datawork.descripcionProd        ;
                  console.log("Descripción Prod ")
                  console.log(this.descrProd)
                  this.edittraspasos.controls['idCliProvO' ].setValue(this.currentTrasp.idCliProv); 
                  this.edittraspasos.controls['empresa'    ].setValue(this.currentTrasp.empresa  ); 
                  this.edittraspasos.controls['recintoOrig'].setValue(this.currentTrasp.recinto  ); 
//                  this.edittraspasos.controls['numFact'    ].setValue(this.currentTrasp.numFact  ); 
                  this.edittraspasos.controls['producto'   ].setValue(this.currentTrasp.producto ); 
                  this.edittraspasos.controls['cantidad'   ].setValue(this.currentTrasp.cantidad ); 

                  this.empresa                             = this.currentTrasp.empresa            , 
                  this.recinto                             = this.currentTrasp.recinto            , 
                  this.idCliProv 	                         = this.currentTrasp.idCliProv 	        , 
                  this.recintoDest                         = this.currentTrasp.recintoDest        , 
                  this.idCliProvDest                       = this.currentTrasp.idCliProvDest      , 
                  this.numPart		         	               = this.currentTrasp.numPart		    	  , 
                  this.numFact                             = this.currentTrasp.numFact            , 
                  this.numPedimentoEntrada                 = this.currentTrasp.numPedimentoEntrada, 
                  this.estatus                             = this.currentTrasp.estatus            , 
                  this.producto                            = this.currentTrasp.producto           , 
                  this.cantidad                            = this.currentTrasp.cantidad           , 
                  this.fechaAlta                           = this.currentTrasp.fechaAlta          , 
                  this.fechaMod                            = this.currentTrasp.fechaMod           , 
                  this.hora                                = this.currentTrasp.hora               , 
                  this.userMod                             = this.currentTrasp.userMod            , 
                  this.entSal                              = this.currentTrasp.entSal             , 
                  this.numFactEnt                          = this.currentTrasp.numFactEnt             

                  this.catPartCtee(this.idCliProv);
                  this.catFactCtee(this.idCliProv);              
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
  get f() { return this.edittraspasos.controls; }

  
catPartCte(id1: any){
  console.log("catPartCte ")
  console.log(id1.target.value)
  this.catPartCtee(id1.target.value);
  this.catFactCtee(id1.target.value);
}  


//Metodo para obtener los registros de partes
catPartCtee(Cte: string){
  console.log("Entre a catPartCtee   " + Cte)
  this.CteSel  = Cte;
  this.traspasosService.viewPartesCteTrasp(Cte)
  .pipe(first())
  .subscribe(
      data => {
        if (data.cr=="00"){          
           this.dataPart = data.contenido;
           console.log("dataPart ")
           console.log(this.dataPart)
           this.obtenPedimentoMet(this.numPart)
           this.f.listaallPartes.patchValue(this.numPart);
        }else{
          this.dataPart       = [];
          this.dataPedimento  = [];
        }
      },
      error => {
        this.alertService.error("Error en la consulta del Catálogo de Partes");              
        this.loading = false;
      });
} // Cierre del método catPartCtee


//Metodo para obtener los registros de facturas
catFactCtee(Cte: string){
  this.traspasosService.viewFactCteTrasp(Cte)
  .pipe(first())
  .subscribe(
      data => {
        if (data.cr=="00"){          
           this.dataFact = data.contenido;
           
           this.f.listaallPedimento.patchValue(this.numPedimentoEntrada);
           this.f.listaallprod.patchValue(this.descrProd);         
           this.f.listaallFac.patchValue(this.numFact);
           this.f.listaallRecO.patchValue(this.recinto);
           this.f.listaallRecD.patchValue(this.recintoDest);
           this.f.listaallCteD.patchValue(this.idCliProvDest);
        }else{
          this.dataFact       = [];
          this.numFact        = "";
        }
      },
      error => {
        this.alertService.error("Error en la consulta del Catálogo de Facturas");              
        this.loading = false;
      });
} // Cierre del método catFactCtee

obtenPedimento(id1: any){
  console.log("obtenPedimento ")
  console.log(id1.target.value)
  this.obtenPedimentoMet(id1.target.value);
} 


//Metodo para obtener los registros de pedimentos
obtenPedimentoMet(Parte: string){
  this.partesService.catPartes(this.CteSel,Parte)
   .pipe(first())
   .subscribe(
      data => {
        if (data.cr=="00"){          
            this.dataPedimento = data.contenido;
        }
      },
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Partes");              
          this.loading = false;
        });
} // Cierre del método obtenPedimento


//Metodo que se invoca cuando se cambia la descripción del producto
cambio(id1: any){
  this.edittraspasos.controls['producto'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);

  let cliente   : string;

  cliente   = this.f.idCliProvO.value; 
  console.log("cliente param"+ cliente) 
  this.obtenExistencia(cliente, this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);
}// Cierre del método cambio


//Metodo que se invoca cuando se cambia la cantidad
cambExist(cant: any){
  if (cant.target.value > this.totalTrasp) {
    this.alertService.error("La cantidad no puede ser mayor a " + this.totalTrasp);
    this.loading = false;
  }else{ if (cant.target.value == 0) {
    this.alertService.error("La cantidad debe ser mayor a cero");
    this.loading = false;
  }
 }
} // Cierre del método cambExist


  //Metodo para obtener el numero de existencia
  obtenExistencia(idCliProv, producto){
    this.totalExist   = 0;
    this.totalConsu   = 0;
    this.totalTrasp   = 0; 
    this.contExist    = 0;
    this.listExist    = [];
    this.facturasService.obtenExistenciaInv(idCliProv, producto, this.consParm)
    .pipe(first())
    .subscribe(
      data => {
        this.dataExist = data.contenido
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
                this.totalConsu = this.totalConsu + item[7]                      
                this.totalExist = this.totalExist + item[8]
                this.totalTrasp = this.totalExist - this.totalConsu
                this.contExist  = this.contExist + 1
             });
             if (this.totalExist == 0){
                console.log("  TOTAL EXIST == 0   ")
                console.log(this.totalTrasp)
                console.log(this.totalConsu)
                console.log(this.totalExist)
                 this.edittraspasos.controls['producto'].setValue("");
                }
               this.edittraspasos.controls['cantidad'].setValue(this.totalTrasp);
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



enviar(){
  if (this.edittraspasos.invalid) {
    this.alertService.error("Es necesario capturar todos los campos que tienen * ");
    this.loading = false;
    return;
} 

this.armatrasp();
this.loading = true;
this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/traspasos';
this.traspasosService.altaTraspaso(this.currentTrasp)
  .pipe(first())
  .subscribe(
    data => {
        this.datawork = data;
        if (this.datawork.cr == "00"){
            this.msgokf();
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
  return      
} //     Cierre del metodo enviar

  
  autorizar() {
  }

  armatrasp(){
    this.currentTrasp = {
        empresa               : this.f.empresa.value                  , 
        recinto               : this.f.listaallRecO.value             , 
        idCliProv             : this.f.idCliProvO.value             ,
        recintoDest           : this.f.listaallRecD.value             , 
        idCliProvDest         : this.f.listaallCteD.value             ,
        numPart		  				  : this.f.listaallPartes.value           ,   
        numFact               : this.f.listaallFac.value                  ,    
        numPedimentoEntrada   : this.f.listaallPedimento.value        ,   
        estatus               : this.estatus                          , 
        producto              : this.f.producto.value                 , 
        cantidad              : this.f.cantidad.value                 ,
        fechaAlta             : this.curr                             , 
        fechaMod              : this.curr                             ,
        hora                  : this.curr1                            , 
        userMod               : this.usuario.substring(0, 8)          ,
        entSal                : this.entSal                           ,
        numFactEnt            : this.f.listaallFac.value                  ,
   }

   if (this.CteParamBol ){
       this.currentTrasp.idCliProv =  this.CteParam; 
//       this.currentTrasp.recinto   =  this.recinto
   }
}     // Cierre del metodo armatrasp

//Metodo para que va a realizar el traspaso 
traspaso(){
  
  //console.log(this.f.clveProduc.invalid)
  if (this.edittraspasos.invalid) {
    this.alertService.error("Es necesario capturar todos los campos que tienen * ");
    this.loading = false;
    return;
  } 
  

  this.armatrasp();
  this.currentTrasp.estatus          = "T" 
  console.log("regrese de armatrasp   ")
  console.log(this.currentTrasp)
  this.loading = true;
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/traspasos';

  this.facturasService.realizaTraspaso(this.currentTrasp.idCliProv, 
                                       this.currentTrasp.producto, 
                                       this.currentTrasp.cantidad, 
                                       this.currentTrasp.recintoDest, 
                                       this.currentTrasp.idCliProvDest, 
                                       this.currentTrasp.numFact)
  .pipe(first())
  .subscribe(
   data => {
     this.dataTrasp = data.contenido
     console.log("realiza traspaso  data contenido dataTrasp ")   
     console.log(this.dataTrasp)
       if (data.cr=="00"){
         this.msgoktr();
           console.log("Traspaso realizado CR = 0")
       }else{
           this.loading = false;
           this.msg = data.descripcion;
           this.alertService.error(this.msg);
     }})
     error => {
         this.alertService.error("No hay conexión con la Base de Datos");
         this.loading = false;
     };
}  // Cierre del método realizaTraspaso

cancelar(clveProduc: string): void {
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/cteyprov';
  this.router.navigate([this.returnUrl]);   
}     // Cierre del metodo cancelar

/*
traspaso(idCliProv, producto){
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/edittraspasos/:idCliProv';
  this.router.navigate([this.returnUrl]);   
}  // Cierre del método traspaso
*/


msgoktr(): void {
  const dialogRef = this.dialog.open(MsgoktrComponent, {
    width: '400px',
    height: '200px',
  });

  dialogRef.afterClosed().subscribe(result => {
    //this.email = result;
  });
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
