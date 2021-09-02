import { Component, OnInit, Inject, LOCALE_ID  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, ProdymatService, SysdtapeService } from './../service';
import { Prodymat, Sysdtape, Login } from '../model'
import { first } from 'rxjs/operators';
import { MsgokpmComponent } from './../msgokpm/msgokpm.component'
import { MatDialog} from '@angular/material/dialog';
import { formatDate } from '@angular/common';


@Component({
  selector: 'app-altaproymat',
  templateUrl: './altaproymat.component.html',
  styleUrls: ['./altaproymat.component.css']
})
export class AltaproymatComponent implements OnInit {
  CurrentDate = new Date();
  curr = formatDate(this.CurrentDate, 'yyyy-MM-dd' ,this.locale);
  curr1 = formatDate(this.CurrentDate, 'hh:mm:ss' ,this.locale);
  clvap: string;
  material: boolean=false;
  altaprodymat: FormGroup;
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  submitted = false;
  msg= '';
  usuari: Login
  apl: Sysdtape;
  datawork: any=[];
  dataworkrol: any=[];
  disponibles: any;
  selectedLocations: any = [];
  currString: string;
  orders = [];
  usuario: string;
  empresa: string;
  recinto: string;
  progUser='SYSALTAS';
  
  loading = false;
  returnUrl: string;
  currentProdymat: Prodymat;

  constructor(
    private consape: SysdtapeService,
    @Inject(LOCALE_ID) public locale: string,
    private fb: FormBuilder,
    private prodymatService: ProdymatService, 
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,

  ) { 
        // mimic async orders
//        of(this.getOrders()).subscribe(orders => {
          this.orders = this.getOrders();
  }

  ngOnInit(): void {
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
    //let userMod = this.usuari["idUsuario"];
  } // Cierre del método ngOnInit

  formafb() {
        this.altaprodymat = this.fb.group({
          'clveProduc':  new FormControl('',[Validators.required]),
          'tipProd':     new FormControl('',[Validators.required]),
          'orders':      new FormControl('',[Validators.required]),
          'descCorta':   new FormControl('',[Validators.required]),
          'descLarga':   new FormControl('',[Validators.required]),
          'descCorIng':  new FormControl('',[Validators.required]),
          'descLarIng':  new FormControl('',[Validators.required]),
          'listaallapl': new FormControl('',[Validators.required]),
          'tip_Mat':     new FormControl('',)
    }); 
  } // Cierre del método formafb

  getOrders() {
    return [
      { id: "S", name: "SI" },
      { id: "N", name: "NO" }
    ];
  }

  cambio(tp: any){
   if (tp.target.value == '7'){
       this.material = true;
   }else{
      this.material = false;
      this.altaprodymat.controls['tip_Mat'].setValue("");
   }
  }

  cancelar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
    this.router.navigate([this.returnUrl]);   
  }  // Cierre del método cancelar

// convenience getter for easy access to form fields
    get f() { return this.altaprodymat.controls; }

  enviar() {
    if (this.altaprodymat.invalid) {
        this.alertService.error("Es necesario capturar todos los campos que tienen * ");
        this.loading = false;
        return;
    }
        this.armausuario();
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
        this.prodymatService.altaprodymat(this.currentProdymat)
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
               
        return   
    } // Cierre del método enviar

  consultaDatosApl(){
    this.clvap = 'AP07';
    this.consape.apeconscve(this.clvap)
    .pipe(first())
    .subscribe(
        data => {
            this.datawork = data;
            if (this.datawork.cr=="00"){
                this.apl = this.datawork.contenido;
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
      this.currentProdymat = {
          clveProduc    : this.f.clveProduc.value,
          tipProd       : this.f.tipProd.value,  
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
