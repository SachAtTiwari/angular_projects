import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.css']
})
export class DownloadsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  courses = [
    {value:"OTP"},
    {value:"TSSV"},
    {value:"ASHRAY 1"},
    {value:"ASHRAY 2"}
  ];
  counsellors = [
    {value:"KVP"},
    {value:"SGP"}

  ];

  onSubmit(form: NgForm){

    console.log("sorm is", form.value);

                                                                            
  }

}
