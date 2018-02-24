import { Component, OnInit,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import swal from 'sweetalert2';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [
    UserService,
  ]
})
export class AttendanceComponent implements OnInit {

  
  contact:string;
  launchModal = false;
  showStatus = false;
  showDelStatus =  false;
  showAddStatus = false;
  showAddMessage = "";
  showAttMessage = "";
  formError = "";
  topic = "";
  

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
   // console.log("param is ", params['course']);

    if(params['course'] === "1"){
       
        if (this.getOTPData == false){
         this._userService.getOTPDevotees()
            .subscribe(userData => {
             console.log("user data is 2", userData);
             if (userData.sdlResult.length > 0){
               this.devotees = userData.result;
             }else{
               this.router.navigateByUrl('/classSdl');
             }
          });
        }

        
    }else if(params["course"] === "2"){
        console.log("in tssvb8 ");

    }else{

    }
   });
    
  }



  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  updateOTPDevotees(){
    console.log("OTP devotess");
    this._userService.getOTPDevotees()
        .subscribe(userData => {
          console.log("user data is ", userData.result);
          this.devotees = userData.result;
    });
  }
  
  showDetails(dv){
   console.log("show detials ", dv["_id"]);
    this.router.navigate(['/showDetails', dv["_id"]]);
  }

 
  markPresent(dv){
    //console.log("in  update", dv);
    this.contact = dv.contact;
    let dialogRef : any;
    dialogRef = this.dialog.open(MarkpresentComponent, {
        width: '300px',
        hasBackdrop: false,
     //   data: { topic:this.topic, selected:"YES"}
     });

     dialogRef.afterClosed().subscribe(result => {
         // console.log('The dialog was closed', result.date);
          result.date = this._userService.parseDate(result.date);
          this._userService.checkIfClassSdlForCourse(dv.course, result.date)
          .subscribe(userData => {
            console.log("user data is ", userData.result);
            if (userData.result.length > 0){

                this.dStatus["date"] = userData.result[0].date;
                this.dStatus["present"] = "YES";
                this.dStatus["topic"] = userData.result[0].topic;
                if(dv.contact){
                  this.dStatus["contact"] =  dv.contact
                  this._userService.markAttendance(this.dStatus)
                    .subscribe(userData => {
                      if(userData["result"] === "ok"){
                        this.showStatus =  true;
                        this.showAttMessage = "Attendance updated successfully";
                        swal("Attendance updated successfully" , "Hari Bol!!", 'success');
                        
                      }else{
                        this.showStatus =  true;            
                        this.showAttMessage = "Attendance already updated";
                        swal("Attendance already updated", "Hari Bol :)", 'warning');
                      }
                    });
                }
            }else{
              console.log("No class sdl for selected date");
              swal("No class sdl for selected date", "Hari Bol..", 'error')
              this.showStatus =  true;            
              this.showAttMessage = "No Class Scheduled for the selected date";
            }
          });

    });
    
  }


  handleDevoteeDialog(){
    let dialogRef = this.dialog.open(AddDevoteeComponent, {
      width: '280px',
      hasBackdrop: false,
      //data: { contact:this.contact }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

      result.dob = this._userService.parseDate(result.dob);
      console.log("date is ", result.dob);

      if (!result.name || !result.email 
        || !result.contact || !result.dob ){
          this.formError = "All fields are mandatory";
      }else{
        
       this._userService.addDevotee(result)
       .subscribe(userData => {
         console.log("Add record is ", userData);
         if(userData["result"] === "ok"){
          console.log("in add record", userData);
          this.showAddStatus =  true;
          this.showAddMessage = "Record added successfully";
          window.location.reload(); 
          
          swal("Hare Krishna, We have new devotee in IYF" , "Hari Bol!!", 'success');
          
         }else{
            this.showAddStatus = true;
            this.showAddMessage = "Record already present";
            swal("Hare Krishna, We already have this record" , "Hari Bol!!", 'warning');
            
          }
         });
       }
    });
  }

  addDevotee(form:NgForm){
    console.log("form is", form.value);
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
            this.showAddMessage = "Record added successfully";
            swal("Hare Krishna, We have new devotee in IYF" , "Hari Bol!!", 'success');
            
           }else{
             this.showAddStatus = true;
             this.showAddMessage = "Record already present";
            swal("Hare Krishna, We already have this record" , "Hari Bol!!", 'warning');
             
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

@Component({
  selector: 'add-devotee',
  templateUrl: 'add-devotee.html',
 
})
export class AddDevoteeComponent {

  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

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


  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog, 
    private router: Router,
    public dialogRef: MatDialogRef<AddDevoteeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  
  _addDevotee(form:NgForm): void{
    //console.log("add devotee", form.value);
    this.dialogRef.close(form.value);
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}