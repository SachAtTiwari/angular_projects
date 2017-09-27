import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {UserService} from './user.service';
import { Router } from "@angular/router";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})

export class LoginComponent{
  uname = "";
                                                                            
  users = [];
  constructor(private _userService: UserService, private router: Router){};
   
  title = 'Welcome to angular dashboard';
                                                                            
  onSubmit(form: NgForm){
    this._userService.getUsers()
       .subscribe(userData => {
          //console.log("user data is ", userData);
          this.users = userData;
          console.log("this users ",this.users[0].id);
          console.log(form.value);
          this.router.navigateByUrl('/home');
       });
                                                                            
  }

}
