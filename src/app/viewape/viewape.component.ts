import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, SysdtapeService } from './../service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Sysdtape } from './../model';

@Component({
  selector: 'app-viewape',
  templateUrl: './viewape.component.html',
  styleUrls: ['./viewape.component.css']
})
export class ViewapeComponent implements OnInit {
  public currentApe: Sysdtape;
  apeForm: FormGroup;
  apl: Sysdtape;
  dataape: any=[];
  dataWork: any=[];
  loading = false;
  msg= '';
  
  
  clvap:      string;
  id1:        string;
  id2:        string;
  indVis:     string;
  desCorta:   string;
  desLarga:   string;

  constructor(
    private consape: SysdtapeService,
    private formBuilder: FormBuilder,

    private activatedRoute: ActivatedRoute,
//    private security: AppSecurity, 
//      private route: ActivatedRoute,
//    private router: Router,
//    private modalService: NgbModal,
//    private dialog: MatDialog,
    private alertService: AlertService
    ) { 
      this.activatedRoute.params.subscribe( params =>{ 
        this.consape.apeconscveidid(params['clvap'])
        .pipe(first())
        .subscribe(
            data => {
              console.log("viewape.component.ts   Params");
              console.log(params['clvap']);
              this.dataWork = data;
              console.log("viewape.component.ts     dataWork")
              console.log(this.dataWork)
              
              if (this.dataWork.cr="00"){  
                  this.currentApe = this.dataWork.contenido;
                  console.log("this.currentApe")
                  console.log(this.currentApe)
    
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

  ngOnInit(): void {
  
  }
  deleteape(){

  }

  ireditape(clvap){

  }

}
