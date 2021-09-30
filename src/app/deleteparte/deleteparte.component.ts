import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AlertService, PartesService } from './../service';

@Component({
  selector: 'app-deleteparte',
  templateUrl: './deleteparte.component.html',
  styleUrls: ['./deleteparte.component.css']
})
export class DeleteparteComponent implements OnInit {
  idUsuario: string = ''; 
  returnUrl: string;
  loading = false;
  msg= '';

  constructor( 
  public dialogRef: MatDialogRef<DeleteparteComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
  private partesService: PartesService,
  private route: ActivatedRoute,
  private router: Router,
  private alertService: AlertService
) { }

ngOnInit(): void {
}

deletepartes(idCliProv: string, numPart: string, numPedimento:string) : void {
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/partes';
//  this.idUsuario = clveProduc;
  this.partesService.deletepartes(idCliProv,numPart, numPedimento)
  .pipe(first())
  .subscribe(
      data => {
        if (data.cr=="00"){
          this.router.navigate([this.returnUrl]);  
          this.onNoClick();
        }else{
          this.loading = false;
          this.msg = this.data.descripcion;
          this.alertService.error(this.msg);
        }
      },
      error => {
        this.alertService.error("Error en el borrado del usuario");
        this.loading = false;
      });    
  }


onNoClick(): void {
  this.dialogRef.close();
}

}

