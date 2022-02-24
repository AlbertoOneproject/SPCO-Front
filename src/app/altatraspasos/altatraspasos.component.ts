import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, PartesService, FacturasService, ProdymatService, ShareService, TraspasosService } from './../service';
import { Login, Prodymat, Traspasos } from '../model'
import { first } from 'rxjs/operators';
import { MsgoktComponent } from './../msgokt/msgokt.component'
import { MsgoktrComponent } from './../msgoktr/msgoktr.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-altatraspasos',
  templateUrl: './altatraspasos.component.html',
  styleUrls: ['./altatraspasos.component.css']
})
export class AltatraspasosComponent implements OnInit {
  CurrentDate   = new Date();
  curr          = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1         = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  dataProd      : Prodymat;
  dataExist     : any[]=[];
  dataTrasp     : any[];
  dataworkprod  : any=[];
  dataCli       : any[]=[];
  dataRecin     : any[]=[];
  dataPart      : any[]=[];
  dataFact      : any[]=[];
  dataPedimento : any[]=[];
  datawork      : any=[];
  altatraspasos : FormGroup;
  msg           = '';
  CteSel        : string;
  usuari        : Login
  usuario       : string;
  empresa       : string;
  recinto       : string;
  loading       = false;
  returnUrl     : string;
  currentTrasp  : Traspasos;
  opc           : string = '0';
  estatus       : string = "G";
  entSal        : string = "S";
  CteParam      : string = "";
  consParm      : string = 'T';
  CteParamBol   : boolean = false;
  totalExist    : number =0;
  //totalConsu    : number =0;
  //totalTrasp    : number =0;
  contExist     : number = 0;
  listExist     : any[]=[];
  
  constructor(
    @Inject(LOCALE_ID) public locale: string,
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
  ) { 
  
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
    this.catClientes();
    this.catRecintos();
    this.consultaProdymat(); 
    this.formafb();
    if (this.CteParamBol) {
      this.altatraspasos.controls['idCliProvO'].setValue(this.CteParam);
      this.catPartCtee(this.CteParam);
      this.catFactCtee(this.CteParam);
    }
    this.usuari    = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario    = this.usuari["idUsuario"];
    let empresa    = this.usuari["idEmpresa"];
    let recinto    = this.usuari["idRecinto"];
    this.usuario   = usuario;
    this.empresa   = empresa;
    this.recinto   = recinto;
    this.altatraspasos.controls['empresa'].setValue(this.empresa);
    if (this.CteParamBol) {
      this.altatraspasos.controls['idCliProvO'].setValue(this.CteParam);
      this.altatraspasos.controls['recintoOrig'].setValue(this.recinto);
      this.catPartCtee(this.CteParam);
//      this.catFactCtee(this.CteParam);
    }
    //let userMod = this.usuari["idUsuario"];
  } // Cierre del método ngOnInit


// Obtiene el catálogo de clientes  
  catClientes(){
    this.partesService.catClientes()
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.dataCli = data.contenido;
             this.f.listaallCteO.patchValue(this.dataCli);
             this.f.listaallCteD.patchValue(this.dataCli);
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
             this.altatraspasos.controls['listaallRecO'].setValue(this.dataRecin);
             this.altatraspasos.controls['listaallRecD'].setValue(this.dataRecin);
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
          if (this.dataworkprod.cr=="00"){
              this.dataProd    = this.dataworkprod.contenido.sysCatProductos;
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


// Llena pantalla
  formafb() {
        this.altatraspasos = this.fb.group({
          'idCliProvO':         new FormControl(''),
          'empresa':            new FormControl('',[Validators.required]),
          'listaallCteO':       new FormControl('',[Validators.required]),
          'listaallCteD':       new FormControl('',[Validators.required]),
          'recintoOrig':        new FormControl(''),
          'listaallRecO':       new FormControl('',[Validators.required]),
          'listaallRecD':       new FormControl('',[Validators.required]),
          'listaallPartes':     new FormControl('',[Validators.required]),
          'listaallPedimento':  new FormControl('',[Validators.required]),
          'numFact':            new FormControl('',[Validators.required]),
          'producto':           new FormControl('',[Validators.required]),
          'listaallprod':       new FormControl('',[Validators.required]),
          'cantidad':           new FormControl('',[Validators.required])
    }); 
  } // Cierre del método formafb


//Metodo que se invoca cuando se cambia la cantidad
  cambExist(cant: any){
    if (cant.target.value > this.totalExist) {
      this.alertService.error("La cantidad no puede ser mayor a " + this.totalExist);
      this.loading = false;
    }else{ if (cant.target.value == 0) {
      this.alertService.error("La cantidad debe ser mayor a cero");
      this.loading = false;
    }
   }
  } // Cierre del método cambExist


//Metodo que se invoca cuando se cambia la descripción del producto
  cambio(id1: any){
    this.altatraspasos.controls['producto'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);

    let cliente   : string;
   
    if (this.CteParamBol){
        cliente   = this.f.idCliProvO.value; 
        console.log("cliente param"+ cliente) 
       }else{
        cliente   = this.f.listaallCteO.value; 
        console.log("cliente sin param"+ cliente) 
       }
    this.obtenExistencia(cliente, this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);
  }    // Cierre del método cambio


  //Metodo para obtener el numero de existencia
  obtenExistencia(idCliProv, producto){
    this.totalExist   = 0;
    this.contExist    = 0;
    this.listExist    = [];
//    this.facturasService.obtenExistenciaReal(idCliProv, producto, this.consParm)
    this.facturasService.obtenExistencia(idCliProv, producto, this.consParm)
    .pipe(first())
    .subscribe(
      data => {
        this.dataExist = data.contenido
          if (data.cr=="00"){
              console.log("obtenExistenciaReal  CR = 0")

              this.dataExist.forEach(item =>{
                this.listExist.push({
                      "idCliProv"  : item[0],
                      "NumPart"    : item[1],
                      "NumPedEnt"  : item[2],
                      "FecEnt"     : item[3],
                      "Producto"   : item[4],
                      "idImpExp"   : item[5],
                      "NumFact"    : item[6],
//                      "Consumidas" : item[7],
                      "Total"      : item[7]});
//                this.totalConsu = this.totalConsu + item[7]                      
                this.totalExist = this.totalExist + item[7]
//                this.totalTrasp = this.totalExist - this.totalConsu
                this.contExist  = this.contExist + 1
             });
             if (this.totalExist == 0){
              this.altatraspasos.controls['producto'].setValue("");
            }
             this.altatraspasos.controls['cantidad'].setValue(this.totalExist);
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


  catPartCte(id1: any){
    this.catPartCtee(id1.target.value);
    this.catFactCtee(id1.target.value);
  }  


//Metodo para obtener los registros de partes
  catPartCtee(Cte: string){
    this.CteSel  = Cte;
    this.facturasService.consPartRetiro(Cte)
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.dataPart = data.contenido;
             console.log("dataPart ")
             console.log(this.dataPart)
//             this.f.listaallPartes.patchValue(this.dataPart);
          }
        },
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Partes");              
          this.loading = false;
        });
  } // Cierre del método catPartCtee


  //Metodo para obtener los registros de facturas
  catFactCtee(Cte: string){
    this.CteSel  = Cte;
    this.facturasService.consFactRetiro(this.CteSel)
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.dataFact = data.contenido;
             console.log("dataFact ")
             console.log(this.dataFact)
//             this.f.listaallPartes.patchValue(this.dataPart);
          }
        },
        error => {
          this.alertService.error("Error en la consulta del Catálogo de Facturas");              
          this.loading = false;
        });
  } // Cierre del método catFactCtee

  validaFact(id1: any){
    console.log("ValidaFact ini")
    console.log(this.dataFact)
    console.log(this.dataFact.length)
    console.log(id1.target.value)

    for (let y=0; y < this.dataFact.length; y++){ 
        console.log("ValidaFact")
        console.log(this.dataFact[y])
        console.log(id1.target.value)
        if (this.dataFact[y] == id1.target.value){
          this.alertService.error("El número de factura ya existe para este cliente");              
          this.loading = false;
        }
    }
  }


  //Metodo para obtener los registros de pedimentos
  obtenPedimento(id1: any){
    this.partesService.catPartes(this.CteSel,id1.target.value)
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

  
  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/traspasos';
    this.router.navigate([this.returnUrl]);   
  }    // Cierre del método cancelar


// convenience getter for easy access to form fields
    get f() { return this.altatraspasos.controls; }


//Metodo para realizar el registro en la BD
  guardar() {
    if (this.altatraspasos.invalid) {
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
                this.msgokt();
            }else{
                this.loading     = false;
                this.msg         = this.datawork.descripcion;
                this.alertService.error(this.msg);
            }
            error => {
              this.alertService.error("Error en el Alta de de registro de traspaso");
              this.loading = false;
            }
        });       
      return      
  } // Cierre del método guardar


  armatrasp(){
      this.currentTrasp = {
          empresa               : this.f.empresa.value                  , 
          recinto               : this.f.listaallRecO.value             , 
          idCliProv             : this.f.listaallCteO.value             ,
          recintoDest           : this.f.listaallRecD.value             , 
          idCliProvDest         : this.f.listaallCteD.value             ,
          numPart		  				  : this.f.listaallPartes.value           ,   
          numFact               : this.f.numFact.value                  ,    
          numPedimentoEntrada   : this.f.listaallPedimento.value        ,   
          estatus               : this.estatus                          , 
          producto              : this.f.producto.value                 , 
          cantidad              : this.f.cantidad.value                 ,
          fechaAlta             : this.curr                             , 
          fechaMod              : this.curr                             ,
          hora                  : this.curr1                            , 
          userMod               : this.usuario.substring(0, 8)          ,
          entSal                : this.entSal                           ,
          numFactEnt            : this.f.numFact.value                  ,
     }

     if (this.CteParamBol ){
         this.currentTrasp.idCliProv =  this.CteParam; 
         this.currentTrasp.recinto   =  this.recinto
     }
  }     // Cierre del metodo armatrasp


//Metodo uno para realizar el traspaso (graba el registro)
  traspaso(){
    if (this.altatraspasos.invalid) {
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
  this.traspasosService.altaTraspaso(this.currentTrasp)
    .pipe(first())
    .subscribe(
      data => {
          this.datawork = data;
          if (this.datawork.cr == "00"){
               this.realizaTraspaso();
          }else{
              this.loading     = false;
              this.msg         = this.datawork.descripcion;
              this.alertService.error(this.msg);
          }
          error => {
            this.alertService.error("Error en el Alta de de registro de traspaso");
            this.loading = false;
          }
      });       
    return      
} // Cierre del método traspaso


//Metodo para que va a realizar el traspaso 
 realizaTraspaso(){
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


  msgokt(): void {
    const dialogRef = this.dialog.open(MsgoktComponent, {
      width: '400px',
      height: '200px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }

  msgoktr(): void {
    const dialogRef = this.dialog.open(MsgoktrComponent, {
      width: '400px',
      height: '200px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }

} //Cierre principal
