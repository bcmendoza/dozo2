import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { UserService } from '../../services/user.service';
import { RegisterComponent } from '.././auth/register/register.component';
import { LoginComponent } from '.././auth/login/login.component';
import { AccountComponent } from '.././auth/account/account.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit {

  user: any = {status: false}

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private _us: UserService,
    public _router: Router
  ){}

  ngOnInit(){
    this.getStatus();
  }

  getStatus(){
    this._us.updateStatus();
    this._us.status$
      .subscribe(result => {
        if(!result['status']) this._router.navigate(['']);
        this.user = result;
      });
  }
  
  openSignUp(){
    this.dialog.open(RegisterComponent, {width: '350px'});
  }

  openLogIn(){
    this.dialog.open(LoginComponent, {width:'350px'})
  }

  openAccount(){
    this.dialog.open(AccountComponent, {
      width:'600px',
      data: this.user,
      autoFocus: false
    })
  }

  logout(){
    this._us.logout()
      .subscribe(result => {
        this.snackbar.open(result['msg'], 'x', {duration: 3000});
        this._router.navigate(['']);
      });
  }

}
