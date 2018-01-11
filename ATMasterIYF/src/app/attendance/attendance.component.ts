import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  devotees = [ 
    {name:"vivek", email:"vivek@gmail.com", dob:"20/04/90", counsellor:"SGP", fp:"1/04/2017", course:"OTP"},
    {name:"Naveen", email:"naveen@gmail.com", dob:"20/08/90", counsellor:"KVP", fp:"9/04/2017", course:"OTP"},

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
  addDevotee(form:ngForm){
    console.log("form is", form.value);
    this.devotees.push(form.value);
  }



}
