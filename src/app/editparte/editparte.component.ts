import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, PartesService, ProdymatService, SysdtapeService } from './../service';
import { Partes, Sysdtape, Login, Prodymat } from '../model'
import { first } from 'rxjs/operators';
import { MsgokpComponent } from './../msgokp/msgokp.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';

interface Tipo {
  Tipo: string;
  desc: string;
}

@Component({
  selector: 'app-editparte',
  templateUrl: './editparte.component.html',
  styleUrls: ['./editparte.component.css']
})
export class EditparteComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1 = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  progUserc     ='ALTAPART';
  dataPais      : any[]=[];
  datauMC       : any[]=[];
  datauMT       : any[]=[];
  opc           : string = '0';
  dataworkprod  : any=[];
  dataProd      : Prodymat;
  datadesMC     : any[];
  datadesMT     : any[];
  datafact      : any[];
  MonManda      : boolean=false;
  factor        : number;


  material: boolean=false;
  usuario: string;
  empresaa: string;
  recintoo: string;
  apC: Sysdtape;
  apT: Sysdtape;
  datosFracc   : any[];
  editparte: FormGroup;
  usuari: Login
  currentPartes: Partes;
  loading = false;
  returnUrl: string;
  editparteform: FormGroup;
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
  
  idCliProv	    : string;                                      
  numPart       : string;                                      
  numPedimento  : string;                                      
  fechaAlta     : string;                                      
  fechaEntrada  : string;                                      
  producto      : string;                                      
  paisOrigen    : string;                                      
  cantidad      : number;                                      
  costounitdls  : number;                                      
  costoTotaldls : number;                                      
  costounitMXP  : number;                                      
  costototalMXP : number;                                      
  tipCambio     : number;                                      
  uMC           : string;                                      
  uMT           : string;                                      
  fraccAranc    : string;                                      
  nico          : string;                                      
  netoOriginal  : number;                                      
  brutoOriginal : number;                                      
  netoConv      : number;                                      
  brutoConv     : number;                                      
  fechaVenc     : string;                                      
  empresa       : string;                                      
  recinto       : string;                                      
  fechaRegistro : string;                                      
  fechaMod      : string;                                      
  hora          : string;                                      
  userMod       : string;     
  

  constructor(
    @Inject(LOCALE_ID) public locale  : string,
    private consape                   : SysdtapeService,
    private prodymatService           : ProdymatService,
    private partesService             : PartesService,
    private activatedRoutee           : ActivatedRoute,
    private fb                        : FormBuilder,
    private route                     : ActivatedRoute,
    private router                    : Router,
    private alertService              : AlertService,
    private dialog                    : MatDialog,
  ) { 
// mimic async orders
    this.orders = this.getOrders();
  }
     
  ngOnInit(): void {
    console.log("entre")
    this.clvap = 'AP04';
    this.consultaDatosApl(this.clvap);
    this.clvap = 'AP07';
    this.consultaDatosApl(this.clvap);
    this.clvap = 'AC07';
    this.consultaDatosApl(this.clvap);
    this.consultaFracc();
    this.consultaProdymat();
    this.formafb();
    this.consultaDatosPartes();
    console.log("datos obtenido")    
    console.log(this.paisOrigen)
//    console.log(this.dataworkprod.contenido.sysCatProductos.descCorIng)
    console.log(this.f.descIngles.value)
    console.log(this.f.uMC.value)
    console.log(this.f.uMT.value)
    console.log()
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
  consultaDatosApl(clvap){
    this.consape.apeconscve(this.clvap)
    .pipe(first())
    .subscribe(
        data => {
            this.datawork = data;
            if (this.datawork.cr=="00"){
              console.log("datawork")
              console.log(this.datawork)
              if (clvap =='AP04'){
                this.dataPais = this.datawork.contenido;
                console.log("paises")
                console.log(this.dataPais)
              }
              if (clvap =='AP07'){
                this.datauMC = this.datawork.contenido;
                console.log("uMC")
                console.log(this.datauMC)
              }
              if (clvap =='AC07'){
                this.datauMT = this.datawork.contenido;
                console.log("uMT")
                console.log(this.datauMT)
              }
          }else {
            this.msg = this.datawork.descripcion;
            this.alertService.error(this.msg);
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
              this.datosFracc = this.dataworkfracc.contenido;
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

consultaProdymat(){    
  this.prodymatService.prodymatTodos(this.opc)
  .pipe(first())
  .subscribe(
      data => {
          this.dataworkprod = data;
          if (this.dataworkprod.cr=="00"){
              console.log("editparte.component consultaProdymat dataworkprod data/dataworkprod")
              console.log(data)
              console.log(this.dataworkprod)
              this.dataProd    = this.dataworkprod.contenido.sysCatProductos;
              this.datadesMC   = this.dataworkprod.contenido.lDescripUMC
              this.datadesMT   = this.dataworkprod.contenido.lDescripuMT
              this.datafact    = this.dataworkprod.contenido.lFactor
              for (let i=0; i < this.dataworkprod.contenido.sysCatProductos.length; i++){
                console.log("entre al for")
                console.log(this.dataworkprod.contenido.sysCatProductos[i].clveProduc)
                console.log(this.currentPartes.producto)
                if (this.dataworkprod.contenido.sysCatProductos[i].clveProduc == this.currentPartes.producto){
                  console.log("entre al if if")
                  console.log(this.dataworkprod.contenido.sysCatProductos[i].descCorIng)
                  console.log(this.dataworkprod.contenido.lDescripUMC[i])
                  console.log(this.dataworkprod.contenido.lDescripuMT[i])
                  this.editparte.controls['descIngles'   ].setValue(this.dataworkprod.contenido.sysCatProductos[i].descCorIng);
                  this.editparte.controls['uMC'          ].setValue(this.dataworkprod.contenido.lDescripUMC[i]);
                  this.editparte.controls['uMT'          ].setValue(this.dataworkprod.contenido.lDescripuMT[i]);
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

formafb() {
  this.editparte = this.fb.group({
    'idCliProv':     new FormControl('',[Validators.required]),
    'numPart':       new FormControl('',[Validators.required]),
    'numPedimento':  new FormControl('',[Validators.required]),
    'fechaEntrada':  new FormControl('',[Validators.required]),
    'listaallpais':  new FormControl('',[Validators.required]),
    'listaallprod':  new FormControl('',[Validators.required]),
    'producto':      new FormControl(''),
    'descIngles':    new FormControl(''),
    'cantidad':      new FormControl('',[Validators.required]),
    'costoUnitMXP':  new FormControl('',[Validators.required]),
    'costototalMXP': new FormControl('',[Validators.required]),
    'costoUnitDLS':  new FormControl('',[Validators.required]),
    'costoTotaldls': new FormControl('',[Validators.required]),
    'tipCambio':     new FormControl('',[Validators.required]),
    'uMC':           new FormControl('',[Validators.required]),
    'uMT':           new FormControl('',[Validators.required]),
    'fraccAranc':    new FormControl('',[Validators.required]),
    'netoOriginal':  new FormControl('',[Validators.required]),
    'brutoOriginal': new FormControl('',[Validators.required]),
    'netoConv':      new FormControl('',[Validators.required]),
    'brutoConv':     new FormControl('',[Validators.required]),
    'fechaVenc':     new FormControl('',[Validators.required])
    }); 
  } // Cierre del método formafb
  
consultaDatosPartes(){
    this.activatedRoutee.params.subscribe( params =>{ 
        this.partesService.partesUnico(params['idCliProv'],params['numPart'],params['numPedimento'])
        .pipe(first())
        .subscribe( 
            data => {
                this.datawork = data;
                console.log("datawork")
                console.log(this.datawork)
                if (this.datawork.cr=="00"){
                    console.log("entre en 00")
                    this.currentPartes = this.datawork.contenido;
                    console.log("editpartes currentPartes")
                    console.log(this.currentPartes)
                    this.editparte.controls['idCliProv'    ].setValue(this.currentPartes.idCliProv	  );
                    this.editparte.controls['numPart'      ].setValue(this.currentPartes.numPart      );
                    this.editparte.controls['numPedimento' ].setValue(this.currentPartes.numPedimento );
                    this.editparte.controls['fechaEntrada' ].setValue(this.currentPartes.fechaEntrada );
//                    this.editparte.controls['listaallpais' ].setValue(this.currentPartes.paisOrigen   );
//                    this.editparte.controls['listaallprod' ].setValue(this.currentPartes.             );
                    this.editparte.controls['producto'     ].setValue(this.currentPartes.producto     );
                    this.editparte.controls['cantidad'     ].setValue(this.currentPartes.cantidad     );
                    this.editparte.controls['costoUnitMXP' ].setValue(this.currentPartes.costounitMXP );
                    this.editparte.controls['costototalMXP'].setValue(this.currentPartes.costototalMXP);
                    this.editparte.controls['costoUnitDLS' ].setValue(this.currentPartes.costounitdls );
                    this.editparte.controls['costoTotaldls'].setValue(this.currentPartes.costoTotaldls);
                    this.editparte.controls['tipCambio'    ].setValue(this.currentPartes.tipCambio    );
//                    this.editparte.controls['uMC'          ].setValue(this.currentPartes.uMC          );
//                    this.editparte.controls['uMT'          ].setValue(this.currentPartes.uMT          );
                    this.editparte.controls['fraccAranc'   ].setValue(this.currentPartes.fraccAranc   );
                    this.editparte.controls['netoOriginal' ].setValue(this.currentPartes.netoOriginal );
                    this.editparte.controls['brutoOriginal'].setValue(this.currentPartes.brutoOriginal);
                    this.editparte.controls['netoConv'     ].setValue(this.currentPartes.netoConv     );
                    this.editparte.controls['brutoConv'    ].setValue(this.currentPartes.brutoConv    );
                    this.editparte.controls['fechaVenc'    ].setValue(this.currentPartes.fechaVenc    );
             

                    this.idCliProv       = this.currentPartes.idCliProv    ,        
                    this.numPart         = this.currentPartes.numPart      ,        
                    this.numPedimento    = this.currentPartes.numPedimento ,        
                    this.fechaAlta       = this.currentPartes.fechaAlta    ,        
                    this.fechaEntrada    = this.currentPartes.fechaEntrada ,        
                    this.producto        = this.currentPartes.producto     ,        
                    this.paisOrigen      = this.currentPartes.paisOrigen   ,        
                    this.cantidad        = this.currentPartes.cantidad     ,        
                    this.costounitdls    = this.currentPartes.costounitdls ,        
                    this.costoTotaldls   = this.currentPartes.costoTotaldls,        
                    this.costounitMXP    = this.currentPartes.costounitMXP ,        
                    this.costototalMXP   = this.currentPartes.costototalMXP,        
                    this.tipCambio       = this.currentPartes.tipCambio    ,        
                    this.uMC             = this.currentPartes.uMC          ,        
                    this.uMT             = this.currentPartes.uMT          ,        
                    this.fraccAranc      = this.currentPartes.fraccAranc   ,        
                    this.nico            = this.currentPartes.nico         ,        
                    this.netoOriginal    = this.currentPartes.netoOriginal ,        
                    this.brutoOriginal   = this.currentPartes.brutoOriginal,        
                    this.netoConv        = this.currentPartes.netoConv     ,        
                    this.brutoConv       = this.currentPartes.brutoConv    ,        
                    this.fechaVenc       = this.currentPartes.fechaVenc    ,        
                    this.empresa         = this.currentPartes.empresa      ,        
                    this.recinto         = this.currentPartes.recinto      ,        
                    this.fechaRegistro   = this.currentPartes.fechaRegistro,        
                    this.fechaMod        = this.currentPartes.fechaMod     ,        
                    this.hora            = this.currentPartes.hora         ,        
                    this.userMod         = this.currentPartes.userMod      , 

                    console.log("editprodymat consultaDatosProdymat fraccAranc");
                    console.log(this.fraccAranc);
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
  get f() { return this.editparte.controls; }

  
  cambio(id1: any){
    this.editparte.controls['uMC'].setValue(this.dataworkprod.contenido.lDescripUMC[id1.target.value]);
    this.editparte.controls['uMT'].setValue(this.dataworkprod.contenido.lDescripUMT[id1.target.value]);
    this.editparte.controls['producto'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);
    this.editparte.controls['descIngles'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].descCorIng);
    this.editparte.controls['fraccAranc'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].fraccAranc);
    this.factor = this.dataworkprod.contenido.lFactor[id1.target.value]

    this.nico        = this.dataworkprod.contenido.sysCatProductos[id1.target.value].nico
    this.uMC         = this.dataworkprod.contenido.sysCatProductos[id1.target.value].uMC
    this.uMT         = this.dataworkprod.contenido.sysCatProductos[id1.target.value].uMT
  
    if (this.dataworkprod.contenido.sysCatProductos[id1.target.value].monedaMandataria == 'MXP'){
        this.MonManda = true;

        this.editparte.controls['costoUnitMXP'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitMXP);
        let CUnitUSD = this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitMXP / this.f.tipCambio.value ;
        this.editparte.controls['costoUnitDLS'].setValue(CUnitUSD);

        let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
        let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
        this.editparte.controls['costototalMXP'].setValue(CTotalMxp);
        this.editparte.controls['costoTotaldls'].setValue(CTotalDLS);
    }

    if (this.dataworkprod.contenido.sysCatProductos[id1.target.value].monedaMandataria == 'USD'){
      this.MonManda = false;

      this.editparte.controls['costoUnitDLS'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitDLS);
      let CUnitMXP = this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitDLS * this.f.tipCambio.value ;
      this.editparte.controls['costoUnitMXP'].setValue(CUnitMXP);

      let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
      let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
      this.editparte.controls['costoTotaldls'].setValue(CTotalDLS);
      this.editparte.controls['costototalMXP'].setValue(CTotalMxp);
    }
  }    // Cierre del método cambio


  TotalMXP(){

    let CUnitUSD = this.f.costoUnitMXP.value / this.f.tipCambio.value ;
    this.editparte.controls['costoUnitDLS'].setValue(CUnitUSD);

    let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
    let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
    this.editparte.controls['costototalMXP'].setValue(CTotalMxp);
    this.editparte.controls['costoTotaldls'].setValue(CTotalDLS);
  }


  TotalUSD(){

    let CUnitMXP = this.f.costoUnitDLS.value * this.f.tipCambio.value ;
    this.editparte.controls['costoUnitMXP'].setValue(CUnitMXP);

    let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
    let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
    this.editparte.controls['costoTotaldls'].setValue(CTotalDLS);
    this.editparte.controls['costototalMXP'].setValue(CTotalMxp);
  }


  netoConvertido(){
    console.log("factor")
    console.log(this.factor)
    let NetoConv     = this.factor * this.f.netoOriginal.value
    this.editparte.controls['netoConv'].setValue(NetoConv);
  }    // Cierre del método netoConvertido


  brutoConvertido(){
    console.log("factor")
    console.log(this.factor)
    let BrutoConv    = this.factor * this.f.brutoOriginal.value
    this.editparte.controls['brutoConv'].setValue(BrutoConv);
  }    // Cierre del método brutoConvertido



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
        console.log(this.currentPartes)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/viewpartes';
        this.partesService.editpartes(this.currentPartes)
          .pipe(first())
          .subscribe(
              data => {
                this.dataworkedit = data;
                if (this.dataworkedit.cr=="00"){
                    this.msgokp();                    
                }
              },
              error => {
                this.alertService.error("Error al enviar el usuario");
                this.loading = false;
              });    
               
      
    } //     Cierre del metodo enviar
  
    armausuario(){
      //this.payLoad = JSON.stringify(this.form.value);
      this.currentPartes = {
        idCliProv	    : this.f.listaallCte.value,
        numPart  	    : this.f.numPart.value,
        numPedimento	: this.f.numPedimento.value,
        fechaEntrada	: this.f.fechaEntrada.value,          
        paisOrigen	  : this.f.listaallpais.value,
        producto      : this.f.producto.value,
        cantidad      : this.f.cantidad.value,
        costounitMXP  : this.f.costoUnitMXP.value,
        costototalMXP : this.f.costototalMXP.value,
        costounitdls  : this.f.costoUnitDLS.value,
        costoTotaldls : this.f.costoTotaldls.value,
        tipCambio     : this.f.tipCambio.value,
        fraccAranc    : this.f.fraccAranc.value, 
        netoOriginal  : this.f.netoOriginal.value, 
        brutoOriginal : this.f.brutoOriginal.value, 
        netoConv      : this.f.netoConv.value, 
        brutoConv     : this.f.brutoConv.value, 
        fechaVenc     : this.f.fechaVenc.value, 

        fechaAlta     : this.curr,
        uMC           : this.uMC, 
        uMT           : this.uMT, 
        nico  	      : this.nico,
        empresa	      : this.empresa,
        recinto       : this.recinto,
        fechaRegistro : this.curr,
        fechaMod      : this.curr,
        hora          : this.curr1, 
        userMod       : this.usuario.substring(0, 8),
      }

        if (this.f.listaallapC.value == ""){
            this.currentPartes.uMC = this.uMC
        } 
        if (this.f.listaallapT.value == ""){
            this.currentPartes.uMT = this.uMT
      } 

    }     // Cierre del metodo armausuario

   
  cancelar(idCliProv: string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/partes';
    this.router.navigate([this.returnUrl]);   
  }     // Cierre del metodo cancelar
  
  msgokp(): void {
    const dialogRef = this.dialog.open(MsgokpComponent, {
      width: '400px',
      height: '200px',
      //data: {idUsuario: this.idUsuario}
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }    // Cierre del método msgok
}
