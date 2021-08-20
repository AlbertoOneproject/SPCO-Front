import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras} from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, SysdtapeService } from './../service';
import { MatDialog} from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DeleteapeComponent } from '../deleteape/deleteape.component';
import { Sysdtape } from './../model';

@Component({
  selector: 'app-viewape',
  templateUrl: './viewape.component.html',
  styleUrls: ['./viewape.component.css']
})
export class ViewapeComponent implements OnInit {
  public currentApe: Sysdtape;
  public ape: string;
  apeForm: FormGroup;
  apl: Sysdtape;
  dataape: any=[];
  dataWork: any=[];
  loading = false;
  msg= '';
  returnUrl: string;
  
  
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
    private route: ActivatedRoute,
    private router: Router,
//    private modalService: NgbModal,
    private dialog: MatDialog,
    private alertService: AlertService
    ) { 
      //this.consape.apeconscveidid(params['clvap'],['id1'],['id2'])
      this.activatedRoute.params.subscribe( params =>{ 
        this.consape.apeconscveidid(params['clvap'],params['id1'],params['id2'])
        .pipe(first())
        .subscribe(
            data => {
              this.dataWork = data;
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
  }
  deleteape(){
    const dialogRef = this.dialog.open(DeleteapeComponent, {
      width: '400px',
      height: '200px',
      data: {clvap: this.clvap, id1: this.id1, id2: this.id2}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.id1 = result;
    });
  }

  ireditape(clvap:string, id1:string, id2:string){
    console.log ("viewape.component.ts ireditape ")
    console.log(clvap)
    console.log(id1)    
    console.log(id2)    
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/editape';
    this.router.navigate([this.returnUrl,{clvap:clvap,id1:id1,id2:id2}]);    
  }

}
