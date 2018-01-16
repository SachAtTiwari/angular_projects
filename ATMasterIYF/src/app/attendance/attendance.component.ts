import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [UserService]
})
export class AttendanceComponent implements OnInit {


  constructor(private _userService: UserService){};

  ngOnInit() {
  }
  email = new FormControl('', [Validators.required, Validators.email]);
  
   getErrorMessage() {
      return this.email.hasError('required') ? 'You must enter a value' :
          this.email.hasError('email') ? 'Not a valid email' :
              '';
  }

  devotees = [ 
    {name:"vivek", mail:"vivek@gmail.com", dob:"20/04/90", counsellor:"SGP", fp:"1/04/2017", course:"OTP"},
    {name:"Naveen", mail:"naveen@gmail.com", dob:"20/08/90", counsellor:"KVP", fp:"9/04/2017", course:"OTP"},

  ];  
  
  
  counsellors = [
    {value:"KVP"},
    {value:"SGP"}
  ];
  
  downloadToEx(dv){
    console.log("download ", dv);

  }

  markPresent(dv){
    console.log("in  update", dv);
  
  }
  addDevotee(form:NgForm){
    console.log("form is", form.value);
   // this.devotees.push(form.value);
    this._userService.addDevotee(form.value);
    /*.subscribe(userData => {
       console.log("user data is ", userData);
    
    });*/

  }

  


}
