import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertService, SysdtapeService } from './../service';
import { ActivatedRoute, Router} from '@angular/router';
import { first } from 'rxjs/operators';
import { Sysdtape } from './../model';

@Component({
  selector: 'app-editape',
  templateUrl: './editape.component.html',
  styleUrls: ['./editape.component.css']
})
export class EditapeComponent implements OnInit {
  public currentApe: Sysdtape;
  dataWork: any=[];
  loading = false;
  msg= '';
  returnUrl: string;
  editapeform: FormGroup;
  datawork: any=[];
   
  clvap:      string;
  id1:        string;
  id2:        string;
  indVis:     string;
  desCorta:   string;
  desLarga:   string;

  constructor(
    private sysdtapeService: SysdtapeService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
//    private security: AppSecurity, 
    private route: ActivatedRoute,
    private router: Router,
//    private modalService: NgbModal,
    //private dialog: MatDialog,
    private alertService: AlertService    
  ) {

    this.activatedRoute.params.subscribe( params =>{ 
      this.sysdtapeService.apeconscveidid(params['clvap'],params['id1'],params['id2'])
      .pipe(first())
      .subscribe(
          data => {
            this.dataWork = data;
            console.log("editape.component.ts Constructor ")
            if (this.dataWork.cr="00"){  
                this.currentApe = this.dataWork.contenido;
                this.clvap      = this.currentApe[0].clvap,
                this.id1        = this.currentApe[0].id1,
                this.id2        = this.currentApe[0].id2,
                this.indVis     = this.currentApe[0].indVis,
                this.desCorta   = this.currentApe[0].desCorta,
                this.desLarga   = this.currentApe[0].desLarga
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


  ngOnInit(): void {
    console.log("editape.component.ts ngOnInit ")
    this.formafb();
//    this.consultaUsuario();
  }
  formafb() {
    this.editapeform = this.fb.group({
        'clvap': new FormControl('', [Validators.required]),
        'id1': new FormControl('', [Validators.required]),
        'id2': new FormControl('',[Validators.required]),
        'indVis': new FormControl('',[Validators.required]),
        'desCorta': new FormControl(''),
        'desLarga': new FormControl('')
    });    
  } // Cierre del método formafb

        // convenience getter for easy access to form fields
        get f() { return this.editapeform.controls; }

  enviar(){
    console.log("editape.component.ts enviar ")
//    if (this.editapeform.invalid) {
  //      this.alertService.error("Es necesario capturar todos los campos que tienen * ");
    //    this.loading = false;
      //  return;
//    }
        console.log("editape.component.ts enviar 1")
        this.armaape();
        this.loading = true;
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
        this.sysdtapeService.editape(this.currentApe)
          .pipe(first())
          .subscribe(
              data => {
                this.datawork = data;
                if (this.datawork.cr="00"){
                    console.log("edit rol usr regreso")
                    console.log(this.datawork)
                    console.log(this.datawork.contenido.id)  
                    this.router.navigate([this.returnUrl]);
                    this.loading = false;                  
                }else{
                    this.loading = false;
                    this.msg = this.datawork.descripcion;
                    this.alertService.error(this.msg);
                }
              },
              error => {
                this.alertService.error("Error al enviar el usuario");
                this.loading = false;
              });   
              
              
  } // Cierre del método enviar

  armaape(){
    this.currentApe = {
        clvap: this.clvap, 
        id1: this.id1, 
        id2: this.id2,
        indVis: this.f.indVis.value,
        desCorta: this.f.desCorta.value,
        desLarga: this.f.desLarga.value 
        }
        console.log("editape.component.ts armaape currentApe")
        console.log(this.currentApe)
  } // Cierre del metodo armausuario

  
  cancelar(clvap:string, id1:string, id2:string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/consultaDatosApe';
    this.router.navigate([this.returnUrl,{clvap:clvap,id1:id1,id2:id2}]); 
  } // Cierre del método cancelar
}
