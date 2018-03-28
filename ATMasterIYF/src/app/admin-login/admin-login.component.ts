import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar, MatDrawerToggleResult} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
//import { window } from 'rxjs/operator/window';


@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  providers: [
    UserService,
  ]
})
export class AdminLoginComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog, 
    private _userService:UserService,
    private router: Router,
   ) { }

  isLoggedIn = false;
  ngOnInit() {
    //console.log("in login init");
  }
  
  
  getErrorMessage() {

  }

  adminLogin(form:NgForm): void{
    console.log("in login", form.value);
    this._userService.adminLogin(form.value)
    .subscribe(data => {
      console.log("result is ", data);
      if(data.result == "ok"){
        this.isLoggedIn = true;
        //localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        window.location.reload()

        this.router.navigate(['/attendance'],
         { queryParams: { course: '5'},

        });
      }
     });
    
  }

 

}