import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AlertService, ProdymatService } from './../service';

@Component({
  selector: 'app-deleteprodymat',
  templateUrl: './deleteprodymat.component.html',
  styleUrls: ['./deleteprodymat.component.css']
})
export class DeleteprodymatComponent implements OnInit {
  idUsuario: string = ''; 
  returnUrl: string;
  loading = false;
  msg= '';

  constructor(
    public dialogRef: MatDialogRef<DeleteprodymatComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private prodymatService: ProdymatService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  deleteprodymat(clveProduc: string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/prodymat';
    this.idUsuario = clveProduc;
    this.prodymatService.deleteprodymat(clveProduc)
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
