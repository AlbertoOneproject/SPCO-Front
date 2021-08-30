import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AlertService, SysdtapeService } from './../service';
import { first } from 'rxjs/operators';
import { Sysdtape } from './../model';


@Component({
  selector: 'app-ape',
  templateUrl: './ape.component.html',
  styleUrls: ['./ape.component.css']
})
export class ApeComponent implements OnInit {
  public currentApe: Sysdtape;
  apeForm: FormGroup;
  loading = false;
  msg= '';
  dataWork: any=[];
  ape: Sysdtape;
  dataape: any=[];
  cve: string;
  returnUrl: string;
  cveapidid:string;
  pantalla: {clvap_pant: string, desCorta_pant: string};
  

  clvap:      string;
  id1:        string;
  id2:        string;
  indVis:     string;
  desCorta:   string;
  desLarga:   string;


  page: number;
  perPage: number;
  perName: string;
  total: number;
  totalPages: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private consape: SysdtapeService,
    private formBuilder: FormBuilder,
    private router: Router,
    private alertService: AlertService,

 
   // private rolService: RolService, 
   // private security: AppSecurity, 
   // private modalService: NgbModal,
   // private dialog: MatDialog,


  ) { 
    //this.page = 1;
    //this.perPage = 6;
    //this.perName = "";
    //this.cve = 'AP08';
    //        this.usuarioService.usuarioid(params['username'])
    //        this.consape.apeconscve(paramsthis.cve, this.page, this.perPage, this.perName);


    
//    this.route.params.subscribe(    (updatedParams) => {  
//         this.clvap = updatedParams['clvap'];      
//        this.desCorta = updatedParams['desCorta'];     
//         console.log("entre");
//        } );
    activatedRoute.params.subscribe(val => {
      // put the code from `ngOnInit` here
             console.log("Parámetros de Elena  ")
      console.log(val);
    });


    //this.activatedRoute.queryParams.subscribe(params => {
    //this.clvap = params["clvap"];
    //this.desCorta = params["desCorta"];
   //     });
    //    console.log("Parámetros de Elena  ")
    //    console.log(this.clvap);
     //   console.log(this.desCorta);


    this.activatedRoute.params.subscribe( params =>{ 
         this.consape.apeconscve(this.activatedRoute.snapshot.queryParamMap.get('clvap'))
        .pipe(first())
        .subscribe(
            data => {
              this.dataWork = data;            
              if (this.dataWork.cr="00"){  
                  this.currentApe = this.dataWork.contenido;
                  this.clvap      = this.currentApe.clvap,
                  this.id1        = this.currentApe.id1,
                  this.id2        = this.currentApe.id2,
                  this.indVis     = this.currentApe.indVis,
                  this.desCorta   = this.currentApe.desCorta,
                  this.desLarga   = this.currentApe.desLarga
              }else{
                this.loading = false;
                this.msg = this.dataWork.descripcion;
                this.alertService.error(this.msg);
              }
            },
            error => {
              this.alertService.error("Error en al visualizar el usuario");
              this.loading = false;
            });   
      })
  }

  ngOnInit() {
    console.log("Hola");    
    //this.clvap_pant = this.route.snapshot.queryParamMap.get('clvap');
    this.pantalla = {
      clvap_pant: this.activatedRoute.snapshot.queryParamMap.get('clvap'),
      desCorta_pant: this.activatedRoute.snapshot.queryParamMap.get('desCorta')
    };
    console.log(this.pantalla.clvap_pant);    
    console.log(this.pantalla.desCorta_pant);    
//    const filter = this.route.snapshot.queryParamMap.get('clvap');
 //   console.log(filter); // Pepperoni
//    this.consape.apeconscve(this.route.snapshot.queryParamMap.get('clvap'))

    this.apeForm = this.formBuilder.group({
      'nombre':new FormControl('', [Validators.required]),
      'items': new FormControl('', [Validators.required])
  });

//*********      this.consultadatosApe(this.cve, this.page, this.perPage, this.perName);
  }

// convenience getter for easy access to form fields
get f() { return this.apeForm.controls; }
  

  consultadatosApe(cve: string, page: number, perPage: number, perName: string){
    this.consape.apeconscves(cve,page,perPage,perName)
    .pipe(first())
    .subscribe(
        data => {
          this.dataape = data;
          if (this.dataape.cr="00"){
            this.ape = this.dataape.contenido;

//            this.page = data.contenido.page;
  //          this.perPage = data.contenido.perPage;
    //        this.total = data.contenido.total;
      //      this.totalPages = data.contenido.totalPages;

          console.log ("ape dataape cons --")
          console.log(this.dataape)
          console.log(this.dataape.cr)
          this.ape = this.dataape.contenido;
          console.log(this.dataape.contenido)          
          console.log(this.ape)          
          console.log(this.ape[1].clvap)
        }else{
          this.loading = false;
//          this.msg = data.descripcion;
          this.alertService.error(this.msg);
    }
  },
    error => {
        this.alertService.error("No hay conexión con la Base de Datos");
        this.loading = false;
    });

  }   // Cierre del método consultadatos

  routeTo(clvap:string, id1:string, id2:string): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/consultaDatosApe';
    this.router.navigate([this.returnUrl,{clvap:clvap,id1:id1,id2:id2}]); 
//    this.router.navigate([this.returnUrl,{clvap:"AP08",id1:"ZZ",id2:"Z"}]); 
  }   // Cierre del método routeTo


  buscar(){
    this.perName = ""
    if (this.f.items.value > 0) {
      this.perPage =  this.f.items.value
    }
    if (this.f.nombre.value != "") {
      this.perName =  this.f.nombre.value
    }
    console.log(this.page)
    console.log(this.perPage)
    console.log(this.perName)
    this.consultadatosApe(this.cve, this.page, this.perPage, this.perName); 
  }   // Cierre del método buscar


}
