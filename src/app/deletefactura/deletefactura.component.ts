import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { first } from 'rxjs/operators';
import { AlertService, FacturasService } from './../service';

@Component({
  selector: 'app-deletefactura',
  templateUrl: './deletefactura.component.html',
  styleUrls: ['./deletefactura.component.css']
})
export class DeletefacturaComponent implements OnInit {
  idUsuario: string = ''; 
  returnUrl: string;
  loading = false;
  msg= '';

  constructor( 
  public dialogRef: MatDialogRef<DeletefacturaComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
  private facturasService: FacturasService,
  private route: ActivatedRoute,
  private router: Router,
  private alertService: AlertService
) { }

ngOnInit(): void {
}

deletefactura(idCliProv: string, numPart: string, numFact:string) : void {
  this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/facturas';
  this.facturasService.deletefactura(idCliProv,numPart, numFact)
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

