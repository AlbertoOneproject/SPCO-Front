import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { first } from 'rxjs/operators';
import { AlertService, SysdtapeService } from './../service';

@Component({
  selector: 'app-deleteape',
  templateUrl: './deleteape.component.html',
  styleUrls: ['./deleteape.component.css']
})
export class DeleteapeComponent implements OnInit {
  clvap:string = ''; 
  id1:string;
  id2:string;
  returnUrl: string;
  loading = false;
  msg= '';
  

  constructor(
    public dialogRef: MatDialogRef<DeleteapeComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private sysdtapeService: SysdtapeService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
  }

  deleteape(clvap:string,id1:string, id2:string) : void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.clvap = clvap;
    this.id1   = id1;
    this.id2   = id2;
    this.sysdtapeService.deleteapeid(clvap,id1,id2)
    .pipe(first())
    .subscribe(
        data => {
          if (data.cr="00"){
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
