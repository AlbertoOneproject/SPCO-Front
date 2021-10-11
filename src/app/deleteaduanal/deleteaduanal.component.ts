import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AlertService, AduanalService } from './../service';

@Component({
  selector: 'app-deleteaduanal',
  templateUrl: './deleteaduanal.component.html',
  styleUrls: ['./deleteaduanal.component.css']
})
export class DeleteaduanalComponent implements OnInit {
  idUsuario: string = ''; 
  returnUrl: string;
  loading = false;
  msg= '';

  constructor( 
  public dialogRef        : MatDialogRef<DeleteaduanalComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
  private aduanalService  : AduanalService,
  private route           : ActivatedRoute,
  private router          : Router,
  private alertService    : AlertService
) { }

ngOnInit(): void {
}

deleteaduanal(numPat: string) : void {
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/aduanal';
  this.aduanalService.deleteaduanal(numPat)
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
        this.alertService.error("Error en el borrado de Facturas");
        this.loading = false;
      });    
  }


onNoClick(): void {
  this.dialogRef.close();
}

}

