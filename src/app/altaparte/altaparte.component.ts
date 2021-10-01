import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, PartesService, SysdtapeService, ProdymatService } from './../service';
import { Partes, Prodymat, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokpComponent } from './../msgokp/msgokp.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-altaparte',
  templateUrl: './altaparte.component.html',
  styleUrls: ['./altaparte.component.css']
})
export class AltaparteComponent implements OnInit {
  dataCli       : any[]=[];
  CurrentDate   = new Date();
  curr          = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1         = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  dataPais      : Sysdtape
  dataProd      : Prodymat;
  datadesMC     : any[];
  datadesMT     : any[];
  datafact      : any[];
  factor        : number;
  opc           : string = '0';
  dataworkprod  : any=[];
  MonManda      : boolean=false;
  clvap         : string;
  altaparte     : FormGroup;
  msg           = '';
  usuari        : Login
  datawork      : any=[];
  usuario       : string;
  empresa       : string;
  recinto       : string;
  nico          : string;
  uMC           : string;
  uMT           : string;
  loading       = false;
  returnUrl     : string;
  currentPartes : Partes;


  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private consape                 : SysdtapeService,
    private consprod                : ProdymatService,
    private fb                      : FormBuilder,
    private partesService           : PartesService, 
    private alertService            : AlertService,
    private route                   : ActivatedRoute,
    private router                  : Router,
    private dialog                  : MatDialog,
  ) { 
  }


  ngOnInit(): void {
    this.catClientes();
    this.clvap     = 'AP04';
    this.consultaDatosApl(this.clvap);
    this.consultaProdymat();
    this.formafb();
    this.usuari    = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario    = this.usuari["idUsuario"];
    let empresa    = this.usuari["idEmpresa"];
    let recinto    = this.usuari["idRecinto"];
    this.usuario   = usuario;
    this.empresa   = empresa;
    this.recinto   = recinto;

    //let userMod = this.usuari["idUsuario"];
  } // Cierre del método ngOnInit


  catClientes(){
    this.partesService.catClientes()
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr=="00"){          
             this.dataCli = data.contenido;
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
                this.dataPais = this.datawork.contenido;
            }else {
                this.alertService.error("Error al obtener información de Países");
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en la Consulta de Países");
            this.loading = false;
        });
  } // Cierre del método consultaDatosApl  


  consultaProdymat(){    
    this.consprod.prodymatTodos(this.opc)
    .pipe(first())
    .subscribe(
        data => {
            this.dataworkprod = data;
            if (this.dataworkprod.cr=="00"){
                console.log("altaparte.component consultaProdymat dataworkprod data/dataworkprod")
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


  formafb() {
        this.altaparte = this.fb.group({
          'listaallCte':   new FormControl('',[Validators.required]),
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


  cambio(id1: any){
    this.altaparte.controls['uMC'].setValue(this.dataworkprod.contenido.lDescripUMC[id1.target.value]);
    this.altaparte.controls['uMT'].setValue(this.dataworkprod.contenido.lDescripUMT[id1.target.value]);
    this.altaparte.controls['producto'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].clveProduc);
    this.altaparte.controls['descIngles'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].descCorIng);
    this.altaparte.controls['fraccAranc'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].fraccAranc);
    this.factor = this.dataworkprod.contenido.lFactor[id1.target.value]

    this.nico        = this.dataworkprod.contenido.sysCatProductos[id1.target.value].nico
    this.uMC         = this.dataworkprod.contenido.sysCatProductos[id1.target.value].uMC
    this.uMT         = this.dataworkprod.contenido.sysCatProductos[id1.target.value].uMT
  
    if (this.dataworkprod.contenido.sysCatProductos[id1.target.value].monedaMandataria == 'MXP'){
        this.MonManda = true;

        this.altaparte.controls['costoUnitMXP'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitMXP);
        let CUnitUSD = this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitMXP / this.f.tipCambio.value ;
        this.altaparte.controls['costoUnitDLS'].setValue(CUnitUSD);

        let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
        let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
        this.altaparte.controls['costototalMXP'].setValue(CTotalMxp);
        this.altaparte.controls['costoTotaldls'].setValue(CTotalDLS);
    }

    if (this.dataworkprod.contenido.sysCatProductos[id1.target.value].monedaMandataria == 'USD'){
      this.MonManda = false;

      this.altaparte.controls['costoUnitDLS'].setValue(this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitDLS);
      let CUnitMXP = this.dataworkprod.contenido.sysCatProductos[id1.target.value].costoUnitDLS * this.f.tipCambio.value ;
      this.altaparte.controls['costoUnitMXP'].setValue(CUnitMXP);

      let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
      let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
      this.altaparte.controls['costoTotaldls'].setValue(CTotalDLS);
      this.altaparte.controls['costototalMXP'].setValue(CTotalMxp);
    }
  }    // Cierre del método cambio


  TotalMXP(){

    let CUnitUSD = this.f.costoUnitMXP.value / this.f.tipCambio.value ;
    this.altaparte.controls['costoUnitDLS'].setValue(CUnitUSD);

    let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
    let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
    this.altaparte.controls['costototalMXP'].setValue(CTotalMxp);
    this.altaparte.controls['costoTotaldls'].setValue(CTotalDLS);
  }


  TotalUSD(){

    let CUnitMXP = this.f.costoUnitDLS.value * this.f.tipCambio.value ;
    this.altaparte.controls['costoUnitMXP'].setValue(CUnitMXP);

    let CTotalMxp = this.f.costoUnitMXP.value * this.f.cantidad.value
    let CTotalDLS = this.f.costoUnitDLS.value * this.f.cantidad.value
    this.altaparte.controls['costoTotaldls'].setValue(CTotalDLS);
    this.altaparte.controls['costototalMXP'].setValue(CTotalMxp);
  }


  netoConvertido(){
    console.log("factor")
    console.log(this.factor)
    let NetoConv     = this.factor * this.f.netoOriginal.value
    this.altaparte.controls['netoConv'].setValue(NetoConv);
  }    // Cierre del método netoConvertido


  brutoConvertido(){
    console.log("factor")
    console.log(this.factor)
    let BrutoConv    = this.factor * this.f.brutoOriginal.value
    this.altaparte.controls['brutoConv'].setValue(BrutoConv);
  }    // Cierre del método brutoConvertido


  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/partes';
    this.router.navigate([this.returnUrl]);   
  }    // Cierre del método cancelar


// convenience getter for easy access to form fields
    get f() { return this.altaparte.controls; }


  enviar() {   
    if (this.altaparte.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }    
        if (this.f.fechaEntrada.value <= this.curr) {
          if (this.f.fechaVenc.value > this.curr){
              this.armausuario();
              this.loading = true;
              this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/partes';
              this.partesService.altaprodymat(this.currentPartes)
                .pipe(first())
                .subscribe(
                    data => {
                        this.datawork = data;
                        if (this.datawork.cr=="00"){
                          this.msgokp();
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
            }else{
              this.alertService.error("La fecha de Vencimiento debe ser Mayor a la fecha de hoy");
              this.loading = false;
            }
        } else{
              this.alertService.error("La fecha de Entrada debe ser Menor o Igual a la fecha de hoy");
              this.loading = false;
        }        
        return   
    } // Cierre del método enviar


  armausuario(){
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
  }     // Cierre del metodo armausuario


  msgokp(): void {
    const dialogRef = this.dialog.open(MsgokpComponent, {
      width: '400px',
      height: '200px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }


} //Cierre principal
