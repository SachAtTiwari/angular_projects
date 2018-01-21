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
   /* this._userService.getAllDevotees()
      .subscribe(userData => {
          console.log("user data is ", userData);
    });*/
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  
  
  getErrorMessage() {
      return this.email.hasError('required') ? 'You must enter a value' :
          this.email.hasError('email') ? 'Not a valid email' :
              '';
  }

  devotees = [ 
    {name:"vivek",contact:"7838138933", mail:"vivek@gmail.com", dob:"20/04/90", counsellor:"SGP", fp:"1/04/2017", topic:"OTP"},
    {name:"Naveen", contact:"7838131235", mail:"naveen@gmail.com", dob:"20/08/90", counsellor:"KVP", fp:"9/04/2017", topic:"OTP"},

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
    if(dv.contact){
      this._userService.markAttendance(dv.contact);
    }
  
  }



  formError = "";
  addDevotee(form:NgForm){
    console.log("form is", form.value);
   // this.devotees.push(form.value);
    if (!form.value.name || !form.value.email || !form.value.contact 
           || !form.value.dob || !form.value.counsellor || !form.value.topic){
             this.formError = "All fields are mandatory";
    }else{
        this._userService.addDevotee(form.value);
        form.reset();
      }
  }
}
