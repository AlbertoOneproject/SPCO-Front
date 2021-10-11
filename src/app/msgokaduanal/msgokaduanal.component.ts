import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-msgokaduanal',
  templateUrl: './msgokaduanal.component.html',
  styleUrls: ['./msgokaduanal.component.css']
})
export class MsgokaduanalComponent implements OnInit {
  returnUrl: string;
  loading = false;
  msg= '';

  constructor(
    public dialogRef: MatDialogRef<MsgokaduanalComponent>,@Inject (MAT_DIALOG_DATA) public data: any,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
  }

  confirmar(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/aduanal';
    this.router.navigate([this.returnUrl]);  
    this.onNoClick();
  }
 
  onNoClick(): void {
    this.dialogRef.close();
  }

}