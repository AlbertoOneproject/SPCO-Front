import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-msgokcp',
  templateUrl: './msgokcp.component.html',
  styleUrls: ['./msgokcp.component.css']
})
export class MsgokcpComponent implements OnInit {
  returnUrl: string;
  loading = false;
  msg= '';

  constructor(
    public dialogRef: MatDialogRef<MsgokcpComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  confirmar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/cteyprov';
    this.router.navigate([this.returnUrl]);  
    this.onNoClick();
  }
 
  onNoClick(): void {
    this.dialogRef.close();
  }

}
