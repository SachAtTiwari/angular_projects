import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from './devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { AdminLoginComponent } from './admin-login/admin-login.component';
//import { window } from 'rxjs/operators/window';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    UserService,
  ]
})

export class AppComponent  {
  constructor(private _userService:UserService) { }

  isLoggedIn = false;
  adminLogout(){
    localStorage.clear();
    window.location.reload();
  }

  toggleClicked(){
    console.log("toggle clicked");
  }

  ngOnInit() {
    //console.log("in login init");
    let getLoggedIn = localStorage.getItem("token");
    if(getLoggedIn){
        this._userService.isTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
            console.log(tokenRes);
            if(tokenRes.result == "ok"){
              this.isLoggedIn = true;
            }
        })
    }
  }
  
}
