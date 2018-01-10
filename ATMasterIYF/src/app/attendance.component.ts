import { Component,OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'attendance-component',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  ngOnInit(){
    console.log("in init");
    this.ifClassSdl = false;
  
  }
  title = 'ISKCON YOUTH FORUM';
  ifNoClassScdlText = "No class scheduled for today";
  ifClassSdl = false;
  showForm = false;
  showSdlClass = false;
  
  speakers = [
    {value:"KVP"},
    {value: "SGP"}
  ];
  counsellors = [
    {value:"KVP"},
    {value:"SGP"}
  ];
  topic = "";
  date = "";

  sdlClasses = [];
  classSdl(){
    console.log("in click");
    this.showForm = true;
  }

  onSubmit(form: NgForm){
    this.showSdlClass = true;
    this.showForm = false;
    this.ifClassSdl = true;
    console.log("sorm is", form.value.date);
    this.sdlClasses.push(form.value); 
    console.log(this.sdlClasses);
                                                                            
  }
}