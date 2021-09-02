import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AlertService, RolService } from './../service';
import { Rol } from '../model/rol';

@Component({
  selector: 'app-deleterol',
  templateUrl: './deleterol.component.html',
  styles: [
  ]
})
export class DeleterolComponent implements OnInit {
  id:string = ''; 
  returnUrl: string;
  loading = false;
  msg= '';
  datawork: any=[];


  constructor(
    public dialogRef: MatDialogRef<DeleterolComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private rolService: RolService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService

  ) { }

  ngOnInit(): void {
  }

  deleterol(id:string): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] ||'/rol';
    this.rolService.deleterol(id)
    .pipe(first())
    .subscribe(
        data => {
          this.datawork = data;          
          if (this.datawork.cr=="00"){
            this.router.navigate([this.returnUrl]);
            this.onNoClick();
          }  
          else{
            this.loading = false;
            this.msg = this.datawork.descripcion;
            this.alertService.error(this.msg);
          }
        },
          error => {
            this.alertService.error("Error en el borrado del rol");  
            this.loading = false;
          });    
    }
    
  onNoClick(): void {
    this.dialogRef.close();
  }
}
