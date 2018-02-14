import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService} from '../devotee.service';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Body } from '@angular/http/src/body';


@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers: [UserService]

})
export class ClassComponent implements OnInit {

  sdlClasses = [];

  constructor(private _userService:UserService) { }

   ngOnInit(){
    console.log("in init");
    //this.ifClassSdl = true;
    this._userService.getSdlClasses()
      .subscribe(classInfo => {
         console.log("class data is ", classInfo.result);
         this.sdlClasses = classInfo.result;
    });
  }

  /*
    Add Contact in place of DOB
    Add New sdl for new class
    Time field
    Check page flow

  */
  title = 'ISKCON YOUTH FORUM';
  ifNoClassScdlText = "Schedule Class for attendance";
  ifClassSdl = true;
  showForm = true;
  showSdlClass = false;
  
  speakers = [
    {value:"KVP"},
    {value: "SGP"}
  ];
  courses = [
    {value:"OTP"},
    {value: "TSSV"},
    {value: "ASHRAY1"},
    {value: "ASHRAY2"}
  ];
  /*counsellors = [
    {value:"KVP"},
    {value:"SGP"}
  ];*/
  topic = "";
  date = "";

  /*sdlClasses = [
  {date: "Wed Jan 17 2018", course: "OTP", speaker: "KVP", counsellor: "SGP", topic: "Art of Mind", time:"5:00"},
  ];*/


  classSdl(){
    console.log("in click");
    this.showForm = true;
  }

  onSubmit(form: NgForm){
  //  this.showSdlClass = true;
    this.showForm = true;
   // this.ifClassSdl = true;
    console.log("form is", form.value);
    if (!form.value.date || !form.value.speaker || !form.value.course 
      || !form.value.time || !form.value.topic){
        //this.formError = "All fields are mandatory";
        console.log("All fields are required")
    }else{
       this._userService.SdlClass(form.value);
       form.reset();
      }
    }                                                                            

}
