import { Component, OnInit,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [UserService]
})
export class AttendanceComponent implements OnInit {

  
  contact:string;
  launchModal = false;
  showStatus = false;
  showDelStatus =  false;
  showAddStatus = false;
  
  dStatus = {};
 /* devotees = [ 
    {name:"vivek",contact:"7838138933", mail:"vivek@gmail.com", dob:"20/04/90", counsellor:"SGP", fp:"1/04/2017", topic:"OTP"},
    {name:"Naveen", contact:"7838131235", mail:"naveen@gmail.com", dob:"20/08/90", counsellor:"KVP", fp:"9/04/2017", topic:"OTP"},

  ];*/
  devotees = [];  
  getOTPData = false;  
  
  counsellors = [
    {value:"KVP"},
    {value:"SGP"}
  ];

  courses = [
    {value:"OTP"},
    {value: "TSSV"},
    {value: "ASHRAY1"},
    {value: "ASHRAY2"}
  ];


  constructor(private route: ActivatedRoute,
    public dialog: MatDialog, 
    private _userService:UserService,
    private router: Router,
    public snackBar: MatSnackBar) {
      console.log("in constructor");
    };


  

  ngOnInit() {
   // console.log("in attendance");
    this.route.queryParams.subscribe(params => {
    console.log("param is ", params['course']);

    if(params['course'] === "1"){
        //console.log("In case 1");
      //  this.check(params);
             
        console.log("otp data ", this.getOTPData);
        if (this.getOTPData == false){
         this._userService.getOTPDevotees()
            .subscribe(userData => {
             console.log("user data is 2", userData.result);
            this.devotees = userData.result;
          });
        }

       /*this._userService.checkIfClassSdlForCourse(params)
        .flatMap((data) => data.result)
        .subscribe((data) => {
          console.log("data is ", data);
          this._userService.getOTPDevotees()
            .subscribe(userData => {
             console.log("user data is 2", userData.result);
            this.devotees = userData.result;
          });
        });*/

        
    }else if(params["course"] === "2"){
        console.log("in tssvb8 ");

    }else{

    }
   });
    
  }



  email = new FormControl('', [Validators.required, Validators.email]);
  
  check(params){
    this._userService.checkIfClassSdlForCourse(params)
        .subscribe(userData => {
          console.log("class sdl data is ", userData);
          this.devotees = userData.result;
          
          if(userData.result[0].course === "OTP"){
            console.log("In case....");
            
            this.updateOTPDevotees();
           //this.getOTPData = true;
          }else{
            this.router.navigateByUrl('/classSdl');
          }
        });
  }


  updateOTPDevotees(){
    console.log("OTP devotess");
    this._userService.getOTPDevotees()
        .subscribe(userData => {
          console.log("user data is ", userData.result);
          this.devotees = userData.result;
    });
  }
  
  getErrorMessage() {
      return this.email.hasError('required') ? 'You must enter a value' :
          this.email.hasError('email') ? 'Not a valid email' :
              '';
  }

  

  showDetails(dv){
    console.log("show detials ", dv);

  }

  markPresent(dv){
   // console.log("in  update", dv.contact);
    this.contact = dv.contact;
    
    let dialogRef = this.dialog.open(MarkpresentComponent, {
      width: '300px',
      hasBackdrop: false,
      //data: { contact:this.contact }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result.date, result.present, result.topic);
      this.dStatus["date"] = result.date;
      this.dStatus["present"] = result.present;
      this.dStatus["topic"] = result.topic;
      console.log("status is", this.dStatus);
      if(dv.contact){
        this.dStatus["contact"] =  dv.contact
        this._userService.markAttendance(this.dStatus)
        .subscribe(userData => {
          console.log("attendance  updated ", userData["result"]);
          if(userData["result"] === "ok"){
              this.showStatus =  true;
          }
        });
      }
    });
  }



  formError = "";
  addDevotee(form:NgForm){
    console.log("form is", form.value);
   // this.devotees.push(form.value);
    if (!form.value.name || !form.value.email || !form.value.contact 
           || !form.value.dob || !form.value.counsellor || !form.value.course){
             this.formError = "All fields are mandatory";
    }else{
        this._userService.addDevotee(form.value)
        .subscribe(userData => {
          console.log("Add record is ", userData);
          if(userData["result"] === "ok"){
            console.log("in add record", userData);
            this.showAddStatus =  true;
           }
        });
        form.reset();
      }
    }

  delRecord(dv){
      console.log("contact", dv.contact);
      this._userService.delRecord(dv.contact)
      .subscribe(userData => {
        console.log("del record is ", userData);
        if(userData["result"] === "ok"){
          console.log("in del record", userData);
          this.showDelStatus =  true;
         }
      });
        
  }
}



@Component({
  selector: 'mark-present',
  templateUrl: 'mark-present.html',
})
export class MarkpresentComponent {

  constructor(
    public dialogRef: MatDialogRef<MarkpresentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  status = [
      {value:"YES"},
      {value:"NO"}
  ];

  updateAtt(form:NgForm): void{
    console.log("update at", form.value);
    this.dialogRef.close(form.value);
    
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}