import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css']
})
export class ClassComponent implements OnInit {

  constructor() { }

   ngOnInit(){
    console.log("in init");
    this.ifClassSdl = true;
  
  }

  /*
    Add Contact in place of DOB
    Add New sdl for new class
    Time field
    Check page flow

  */
  title = 'ISKCON YOUTH FORUM';
  ifNoClassScdlText = "No class scheduled for today";
  ifClassSdl = true;
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

  sdlClasses = [
  {date: "Wed Jan 17 2018", speaker: "KVP", counsellor: "SGP", topic: "Art of Mind"},
  ];
  classSdl(){
    console.log("in click");
    this.showForm = true;
  }

  onSubmit(form: NgForm){
  //  this.showSdlClass = true;
    this.showForm = false;
   // this.ifClassSdl = true;
    console.log("sorm is", form.value.date);
    this.sdlClasses.push(form.value); 
    console.log(this.sdlClasses);
                                                                            
  }

}
