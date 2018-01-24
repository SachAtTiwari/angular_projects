import { Component, OnInit,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';



@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [UserService]
})
export class AttendanceComponent implements OnInit {

  
  contact:string;
  dStatus = {};
  devotees = [ 
    {name:"vivek",contact:"7838138933", mail:"vivek@gmail.com", dob:"20/04/90", counsellor:"SGP", fp:"1/04/2017", topic:"OTP"},
    {name:"Naveen", contact:"7838131235", mail:"naveen@gmail.com", dob:"20/08/90", counsellor:"KVP", fp:"9/04/2017", topic:"OTP"},

  ];  
  
  
  counsellors = [
    {value:"KVP"},
    {value:"SGP"}
  ];


  constructor(public dialog: MatDialog, private _userService:UserService) {};

  ngOnInit() {
    console.log("in attendance");
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


  downloadToEx(dv){
    console.log("download ", dv);

  }

  markPresent(dv){
    console.log("in  update", dv.contact);
    this.contact = dv.contact;
    
    let dialogRef = this.dialog.open(MarkpresentComponent, {
      width: '300px',
      hasBackdrop: false,
      data: { contact:this.contact }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result.date, result.present, result.topic);
      this.dStatus["date"] = result.date;
      this.dStatus["present"] = result.present;
      this.dStatus["topic"] = result.topic;
      console.log("status is", this.dStatus);
      if(dv.contact){
        this.dStatus["contact"] =  dv.contact
        this._userService.markAttendance(this.dStatus);
      }
    });

  
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