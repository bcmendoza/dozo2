import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  subscription;
  user;
  
  constructor(
    private _as: AuthService,
    private _router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.subscription = this._as.status$
      .subscribe(result => {
        if(!result['status']) {
          this._router.navigate(['']);
          this.snackbar.open(result['msg'], 'x', {duration: 3000})
        }
        this.user = result;
      });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}