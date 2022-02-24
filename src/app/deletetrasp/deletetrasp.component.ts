import { Component, OnInit, Inject  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AlertService, ProdymatService, ShareService, TraspasosService } from './../service';
import { first } from 'rxjs/operators';
import { Traspasos } from '../model/traspasos';

@Component({
  selector: 'app-deletetrasp',
  templateUrl: './deletetrasp.component.html',
  styleUrls: ['./deletetrasp.component.css']
})
export class DeletetraspComponent implements OnInit {
  currentTrasp  : Traspasos;
  returnUrl     : string;
  loading       = false;
  msg           = '';

  idCliProv     : string; 
  numPart       : string; 
  numFact       : string; 
  numPedi       : string;

  dataDel       : any=[];


  constructor( 
  public dialogRef: MatDialogRef<DeletetraspComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
  private traspasoService        : TraspasosService,
  private route                  : ActivatedRoute,
  private router                 : Router,
  private alertService           : AlertService
) { }


ngOnInit(): void {
}


deletetraspaso(idCliProv:string, numPart: string, numFact: string, numPedi: string) : void {
  console.log("delete traspaso ")

  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/traspasos';
  this.traspasoService.deletetraspasos(idCliProv, numPart, numFact, numPedi)
  .pipe(first())
  .subscribe(
      data => {
        console.log(" regrese del servicio deletetraspasos   ===>  ")
        console.log(data)
        this.dataDel = data
        if (this.dataDel.cr == "00"){
            this.router.navigate([this.returnUrl]);  
            this.onNoClick();
        }else{
          this.loading = false;
          this.msg = this.data.descripcion;
          this.alertService.error(this.msg);
        }
      },
      error => {
        this.alertService.error("Error en el borrado de Facturas");
        this.loading = false;
      });    
  }


onNoClick(): void {
  this.dialogRef.close();
}

}


