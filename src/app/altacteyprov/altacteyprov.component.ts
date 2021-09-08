import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, CteyprovService, SysdtapeService } from './../service';
import { Cteyprov, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokpmComponent } from './../msgokpm/msgokpm.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';

interface Tipo {
  Tipo: string;
  desc: string;
}

interface Mpo {
  id    : string;
  nombre: string;
}

@Component({
  selector: 'app-altacteyprov',
  templateUrl: './altacteyprov.component.html',
  styleUrls: ['./altacteyprov.component.css']
})

export class AltacteyprovComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1 = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  clvap: string;
  material: boolean=false;
  tipCteparam: boolean=false;
  altacteyprov: FormGroup;
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  submitted = false;
  msg= '';
  usuari: Login
  apl: Sysdtape;
  orders = [];

  datacp: any=[];
  datawork: any=[];
  dataworkrol: any=[];
  disponibles: any;
  selectedLocations: any = [];
  currString: string;

  usuario: string;
  empresa: string;
  recinto: string;
  cvePrMt: string;
  progUser='SYSALTAS';
  
  loading = false;
  returnUrl: string;
  currentCteyprov: Cteyprov;
  tipProd:       string;  

  listTipcte = [];

  cteyprod: Tipo[] = [
    {Tipo: '1', desc: 'Contribuyente'},
    {Tipo: '2', desc: 'Cliente'},
    {Tipo: '3', desc: 'Destinatario'},
    {Tipo: '4', desc: 'Proveedor'},
    {Tipo: '5', desc: 'Transportista'}
  ];
 
  cvempo: Mpo [];

  constructor(
    private consape: SysdtapeService,
    @Inject(LOCALE_ID) public locale: string,
    private fb: FormBuilder,
    private cteyprovService: CteyprovService, 
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
  ) { 
        if (this.route.snapshot.paramMap.get('Tipo') != "0"  ){
            this.cvePrMt = this.route.snapshot.paramMap.get('Tipo');
            this.tipCteparam = true;
            console.log("con valor")
            console.log(this.cvePrMt)
        }else{
            this.tipCteparam = false;
            console.log("sin valor")
            this.cvePrMt = '0';
            this.listTipcte = this.cteyprod;
            console.log("altacteyprov.component contructor listTipcte")
            console.log(this.listTipcte)
            console.log(this.tipCteparam)
        }
// mimic async orders
//        of(this.getOrders()).subscribe(orders => {
          this.orders = this.getOrders();
  }

  ngOnInit(): void {
        //this.clvap_pant = this.route.snapshot.queryParamMap.get('clvap');
    this.consultaDatosApl();
    this.submitted = true;
    this.formafb();
    this.usuari = JSON.parse(localStorage.getItem('currentUserLog'));
    let usuario = this.usuari["idUsuario"];
    let empresa = this.usuari["idEmpresa"];
    let recinto = this.usuari["idRecinto"];
    this.usuario = usuario;
    this.empresa = empresa;
    this.recinto = recinto;
    if (this.tipCteparam) {
        for (let i=0; i < this.cteyprod.length; i++){ 
        if (this.cteyprod[i].Tipo == this.cvePrMt){
           this.altacteyprov.controls['tipCte'].setValue(this.cteyprod[i].desc);
        }
      }
      if (this.cvePrMt=='7'){
        this.material = true;
      }
    }
    //let userMod = this.usuari["idUsuario"];
  } // Cierre del método ngOnInit

  formafb() {
        this.altacteyprov = this.fb.group({
          'tipCte':       new FormControl(''),
          'listaTipCte':  new FormControl(''),
          'idCliProv':    new FormControl('',[Validators.required]),
          'nomDenov':     new FormControl('',[Validators.required]),
          'orders':       new FormControl('',[Validators.required]),
          'nomContacto':  new FormControl('',[Validators.required]),
          'immexCveRec':  new FormControl('',[Validators.required]),
          'rfc':          new FormControl('',[Validators.required]),
          'idTax':        new FormControl('',[Validators.required]),
          'curp':         new FormControl('',[Validators.required]),
          'listaallapl':  new FormControl('',[Validators.required]),
          'cp':           new FormControl('',[Validators.required]),
          'listaallmun':  new FormControl('',[Validators.required])
/*          
          '':    new FormControl('',[Validators.required]),
          '':   new FormControl('',[Validators.required]),
          '':   new FormControl('',[Validators.required]),
          '':  new FormControl('',[Validators.required]),
          '':    new FormControl('',[Validators.required]),
          '':   new FormControl('',[Validators.required]),
          '':   new FormControl('',[Validators.required]),
          '':  new FormControl('',[Validators.required]),
          '':    new FormControl('',[Validators.required]),
          '':   new FormControl('',[Validators.required]),
          '':   new FormControl('',[Validators.required]),
          '':  new FormControl('',[Validators.required]),
          'tip_Mat':      new FormControl('')
*/          
    }); 
  } // Cierre del método formafb

  getOrders() {
    return [
      { id: "N", name: "Nacional" },
      { id: "E", name: "Extranjero" }
    ];
  }
  
  obtenCP(cp: any){
/*    
   if (cp.target.value == '7'){
       this.material = true;
   }else{
      this.material = false;
      this.altacteyprov.controls['tip_Mat'].setValue("");
   }
   */
   console.log("altacteyprov.ts obtencp cp") 
   console.log(cp.target.value)
   this.cteyprovService.obtenCP(cp.target.value)
   .pipe(first())
   .subscribe(
       data => {
        if (data.cr=="00"){         
            this.datacp = data.contenido
            console.log("CP regresé correcto")
            console.log(this.datacp)
            console.log(this.datacp.length)
            
            for (let i=0; i < this.datacp.length; i++){ 
                 console.log("contador "+i)
                 console.log(this.cvempo)
                 console.log(this.datacp[i].cMnpio)
                 console.log(this.cvempo[i].id)
                 this.cvempo[i].id     = this.datacp[i].cMnpio;
                 this.cvempo[i].nombre = this.datacp[i].dMnpio;
            }
            console.log("altacteyprov.ts obtencp cvempo")
            console.log(this.cvempo)
         }else{
           this.loading = false;
           this.msg     = data.descripcion;
           this.alertService.error(this.msg);
         }
       error => {
         this.alertService.error("Error al obtener el Código Postal");
         this.loading = false;
       }
     });
  return   
  }       // Cierre del método obtenCP

  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
    this.router.navigate([this.returnUrl]);   
  }  // Cierre del método cancelar

// convenience getter for easy access to form fields
    get f() { return this.altacteyprov.controls; }

  enviar() {
    console.log(this.f.clveProduc.invalid)
    console.log(this.f.tipProd.invalid)
    console.log(this.f.listaTipProd.invalid)
    console.log(this.f.orders.invalid)
    console.log(this.f.descCorta.invalid)
    console.log(this.f.descLarga.invalid)
    console.log(this.f.descCorIng.invalid)
    console.log(this.f.descLarIng.invalid)
    console.log(this.f.listaallapl.invalid)
    console.log(this.f.tip_Mat.invalid)


    if (this.altacteyprov.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
//      if (this.tipProdparam ){
//         if (!this.tipProdparam && this.f.listaTipProd.value != null){
        this.armausuario();
        console.log ("altaproymat.component.ts enviar currentProdymat")
        console.log(this.currentCteyprov)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
        this.cteyprovService.altacteyprov(this.currentCteyprov)
            .pipe(first())
            .subscribe(
                data => {
                    this.datawork = data;
                    if (this.datawork.cr=="00"){
                      this.msgokpm();
                  }else{
                    this.loading = false;
                    this.msg     = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                  }
                error => {
                  this.alertService.error("Error en el Alta de Productos y Materiales");
                  this.loading = false;
                }
              });
//            }else{
//              this.alertService.error("Favor de capturar el Tipo de Producto");
//              this.loading = false;
//            } 
//       }         
        return   
    } // Cierre del método enviar

  consultaDatosApl(){
    this.clvap = 'AP04';
    this.consape.apeconscve(this.clvap)
    .pipe(first())
    .subscribe(
        data => {
            this.datawork = data;
            if (this.datawork.cr=="00"){
                this.apl = this.datawork.contenido;
                console.log("consultaDatosApl AP04")
                console.log(this.apl);
            }else {
                this.alertService.error("Las contraseñas no coinciden");
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en el Alta de Usuario");
            this.loading = false;
        });
  } // Cierre del método consultaDatosApl
    
    
  armausuario(){
  /*
      this.currentCteyprov = {
        
          clveProduc    : this.f.clveProduc.value,
          tipProd       : this.f.listaTipProd.value,  
          indVis        : this.f.orders.value, 
          descCorta     : this.f.descCorta.value, 
          descLarga     : this.f.descLarga.value, 
          descCorIng    : this.f.descCorIng.value, 
          descLarIng    : this.f.descLarIng.value, 
          uM            : this.f.listaallapl.value, 
          empresa	      : this.empresa,
          recinto       : this.recinto,
          fechaAlta     : this.curr,
          fechaMod      : this.curr,
          hora          : this.curr1, 
          userMod       : this.usuario.substring(0, 8),
          tip_Mat       : this.f.tip_Mat.value
          
      }    
      if (this.tipProdparam){
          this.currentCteyprov.tipProd = this.cvePrMt
      } 
      */  
  }     // Cierre del metodo armausuario

  msgokpm(): void {
    const dialogRef = this.dialog.open(MsgokpmComponent, {
      width: '400px',
      height: '200px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }


} //Cierre principal
