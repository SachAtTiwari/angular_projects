import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService} from '../devotee.service';
import {FormControl, Validators} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { Body } from '@angular/http/src/body';
//import { window } from 'rxjs/operator/window';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import swal from 'sweetalert2';




@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.css'],
  providers: [UserService]

})
export class ClassComponent implements OnInit {

  displayedColumns = ['Date', 'Speaker', 'Course', 'Topic'];
  ELEMENT_DATA: Element[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  sdlClasses = [];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  constructor(private _userService:UserService,private router: Router) { }

   isLoggedIn = false;
   ngOnInit(){
    console.log("in init");
    let getLoggedIn = localStorage.getItem("token");
   // console.log("token is in atte init",getLoggedIn);
    if(getLoggedIn){
        this._userService.isTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
            console.log("token res", tokenRes);
            if(tokenRes.result == "ok"){
              this.isLoggedIn = true;
            }
        })
        this._userService.getSdlClasses()
          .subscribe(classInfo => {
            this.dataSource.data = classInfo.result;
            //console.log("class data is ", this.dataSource.data);
            
        });
    }else{
      this._userService.getSdlClasses()
          .subscribe(classInfo => {
            this.dataSource.data = classInfo.result;
            //console.log("class data is ", this.dataSource.data);
            
        });
    }
}

 
  title = 'ISKCON YOUTH FORUM';
  ifNoClassScdlText = "Schedule Class for attendance";
  ifClassSdl = true;
  showForm = true;
  showSdlClass = false;
  
  speakers = [
    {value:"HG Shyam Gopal Prabhuji"},
    {value:"HG Kalpvraksha Prabhuji"},
    {value:"HG Vaidant Chaitnya Prabhuji"},
    {value:"HG Pundrik Vidhyanidhi Prabhuji"},
    {value:"HG Jagadanand Pandit Prabhuji"},
    
  ];

  courses = [
    {value:"OTP"},
    {value: "TSSV"},
    {value: "ASHRAY1"},
    {value: "ASHRAY2"},
    {value: "UMANG"},
  ];
  
  topic = "";
  date = "";


  classSdl(){
    console.log("in click");
    this.showForm = true;
  }

  sdlClass(form: NgForm){
  //  this.showSdlClass = true;
   // this.ifClassSdl = true;
   form.value.date = this._userService.parseDate(form.value.date);
   console.log("form is", form.value);
    if (!form.value.date || !form.value.speaker || !form.value.course 
      || !form.value.time || !form.value.topic){
        //this.formError = "All fields are mandatory";
        console.log("All fields are required")
       // swal("All fields are required to Schedule a class", "Hari Bol..", 'warning');
        swal({

            type: 'warning',
            title: 'All fields are required to Schedule a class',
            html: "Hari Bol!!",
            showConfirmButton: false,
            timer: 1500
        })
        


    }else{
       this._userService.SdlClass(form.value);
       form.reset();
       //window.location.reload()
       //swal("Class Scheduled ", "Hari Bol..", 'success');
      this.router.navigate(['/downloads']).then(() => { this.router.navigate(['/classSdl']); });


        swal({

            type: 'success',
            title: 'Class Scheduled ',
            html: "Hari Bol!!",
            showConfirmButton: false,
            timer: 1500
        })
       
      }
    }                                                                            

}
