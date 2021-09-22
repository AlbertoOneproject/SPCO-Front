import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, CteyprovService, SysdtapeService } from './../service';
import { Cteyprov, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokcpComponent } from './../msgokcp/msgokcp.component'
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
  dataedo: any=[];
  datawork: any=[];
  dataworkrol: any=[];
  disponibles: any;
  selectedLocations: any = [];
  currString: string;

  indAct: string = "A";
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
 
  cveedo: Mpo []=[];
  cvempo: Mpo []=[];
  cveloc: Mpo []=[];
  cvecol: Mpo []=[];
 

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
//            this.listTipcte = this.cteyprod;
//            console.log("altacteyprov.component contructor listTipcte")
//            console.log(this.listTipcte)
            console.log(this.tipCteparam)
        }
// mimic async orders
//        of(this.getOrders()).subscribe(orders => {
          this.orders = this.getOrders();
  }

  ngOnInit(): void {
        //this.clvap_pant = this.route.snapshot.queryParamMap.get('clvap');
    this.submitted = true;
    this.formafb();
    this.consultaDatosApl();
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
          'listaalledo':  new FormControl('',[Validators.required]),
          'listaallmun':  new FormControl('',[Validators.required]),
          'listaallloc':  new FormControl('',[Validators.required]),
//          'listaallcol':  new FormControl('',[Validators.required]),          
          'calle':        new FormControl('',[Validators.required]),          
          'numExt':       new FormControl('',[Validators.required]),          
          'numInte':      new FormControl('',[Validators.required]),          
          'email':        new FormControl('',[Validators.required]),          
          'tel':          new FormControl('',[Validators.required])                   
    }); 
  } // Cierre del método formafb

  getOrders() {
    return [
      { id: "N", name: "Nacional" },
      { id: "E", name: "Extranjero" }
    ];
  }
  
  obtenEdo(cp: any){
    this.cveedo = [];
    this.cvempo = [];
    this.cvecol = [];
    this.cveloc = [];
   console.log("altacteyprov.ts obtencp cp") 
   console.log(cp.target.value)
   this.cteyprovService.obtenCP(cp.target.value)
   .pipe(first())
   .subscribe(
       data => {
        if (data.cr=="00"){         
            this.datacp = data.contenido    
            console.log("altacteyprov.component.ts obtenCP");            
            console.log(this.datacp);      
            for (let i=0; i < this.datacp.length; i++){ 
                 if (i>0){
                   console.log(this.datacp[i-1].cEstado)
                   console.log(this.datacp[i].cEstado)
                   if (this.datacp[i-1].cEstado != this.datacp[i].cEstado){
                       console.log("entre a diferentes")
                       this.cveedo.push({id:this.datacp[i].cEstado,nombre:this.datacp[i].dEstado});
                   }
                 }else{
                  console.log("entre a iguales")
                  this.cveedo.push({id:this.datacp[i].cEstado,nombre:this.datacp[i].dEstado});
                 }
            }
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

  obtenMpo(listedoid: any){
    this.cvempo = [];
    console.log("obtenMpo")
    console.log(listedoid.target.value)
    for (let i=0; i < this.datacp.length; i++) { 
      if (this.datacp[i].cEstado == listedoid.target.value){
        if (i>0){
          console.log(this.datacp[i-1].cMnpio)
          console.log(this.datacp[i].cMnpio)
          if (this.datacp[i-1].cMnpio != this.datacp[i].cMnpio){
              console.log("entre a diferentes mpo")
              this.cvempo.push({id:this.datacp[i].cMnpio,nombre:this.datacp[i].dMnpio});
          }
        }else{
         console.log("entre a iguales mpo")
         this.cvempo.push({id:this.datacp[i].cMnpio,nombre:this.datacp[i].dMnpio});
        }
      }
    }
  }

  obtenCol(listmpoid: any){
    this.cvecol = [];
    console.log("obtenCol")
    console.log(listmpoid.target.value)
    for (let i=0; i < this.datacp.length; i++) { 
      if (this.datacp[i].cMnpio == listmpoid.target.value){
        if (i>0){
          console.log(this.datacp[i-1].idAsentaCpcons)
          console.log(this.datacp[i].idAsentaCpcons)
          if (this.datacp[i-1].idAsentaCpcons != this.datacp[i].idAsentaCpcons){
              console.log("entre a diferentes col")
              this.cvecol.push({id:this.datacp[i].idAsentaCpcons,nombre:this.datacp[i].dAsenta});
          }
        }else{
         console.log("entre a iguales col")
         this.cvecol.push({id:this.datacp[i].idAsentaCpcons,nombre:this.datacp[i].dAsenta});
        }
      }
    }
  }

  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
    this.router.navigate([this.returnUrl]);   
  }  // Cierre del método cancelar

// convenience getter for easy access to form fields
    get f() { return this.altacteyprov.controls; }

  enviar() {
//    console.log(this.f.clveProduc.invalid)
    if (this.altacteyprov.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
    
//      if (this.tipProdparam ){
//      if (!this.tipProdparam && this.f.listaTipProd.value != null){
        this.armausuario();
        console.log ("altaproymat.component.ts enviar currentCteyprov")
        console.log(this.currentCteyprov)
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
        this.cteyprovService.altacteyprov(this.currentCteyprov)
            .pipe(first())
            .subscribe(
                data => {
                    this.datawork = data;
                    if (this.datawork.cr=="00"){
                      this.msgokcp();
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
                this.alertService.error("Error al obtener información de Países");
                this.loading = false;
            }
          },
          error => {
            this.alertService.error("Error en el Alta de Usuario");
            this.loading = false;
        });
  } // Cierre del método consultaDatosApl
    
    
  armausuario(){
  
      this.currentCteyprov = {

        nomDenov			: this.f.nomDenov.value,        
        idCliProv			: this.f.idCliProv.value,     
        rfc						: this.f.rfc.value,           
        immexCveRec		: this.f.immexCveRec.value,   
        nomContacto		: this.f.nomContacto.value,   
        nal						: this.f.orders.value,        
        idTax					: this.f.idTax.value,         
        país					: this.f.listaallapl.value,     
        colonia				: ' ' ,   
        curp					: this.f.curp.value,            
        estado				: this.f.listaalledo.value,     
        numExt				: this.f.numExt.value,          
        numInte				: this.f.numInte.value,       
        cp						: this.f.cp.value,              
        calle					: this.f.calle.value,         
        localidad			: this.f.listaallloc.value,   
        municipio			: this.f.listaallmun.value,   
        email					: this.f.email.value,         
        tel						: this.f.tel.value,           
        tipo					: this.f.listaTipCte.value,     
                                                     
        indAct        : this.indAct,
        empresa	      : this.empresa,               
        recinto       : this.recinto,                
        fechaAlta     : this.curr,                   
        fechaMod      : this.curr,                   
        hora          : this.curr1,                  
        userMod       : this.usuario.substring(0, 8)   
      }    
      if (this.tipCteparam){
          this.currentCteyprov.tipo = this.cvePrMt
      }
/*
      if (this.currentCteyprov.nal == "N"){
          this.currentCteyprov.nal = "Nacional"
      }else{
          this.currentCteyprov.nal = "Extranjero"
      }         
*/      
  }     // Cierre del metodo armausuario

  msgokcp(): void {
    const dialogRef = this.dialog.open(MsgokcpComponent, {
      width: '400px',
      height: '200px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      //this.email = result;
    });
  }


} //Cierre principal
