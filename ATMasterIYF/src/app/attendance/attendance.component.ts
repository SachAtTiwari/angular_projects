import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import 'datatables.net';


@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css'],
  providers: [
    UserService,
  ]
})

export class AttendanceComponent implements OnInit {
  displayedColumns = ['name', 'contact', 'counsellor', 'actions'];
  ELEMENT_DATA: Element[] = [];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator: MatPaginator;

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

  
  contact:string;
  launchModal = false;
  showAddDevotee = false;
  formError = "";
  topic = "";
  devoteeData = {};
  loading = false;
  con = "";
  values = '';

  onKeyUp(event: any) { // without type info
    console.log("event is ", event.target.value);
    this.values = event.target.value ;
    this.getSearchedDevotee(this.values);
    
    /*if(this.values.length == 10){
      this.getSearchedDevotee(this.values);
    }*/
  }
  
  getSearchedDevotee(contact){
    this.loading = true;
    if(contact.length != 10 ){
        alert('invalid mobile no');
         this.loading = false;
    }else if(contact.length == 10 && contact != ""){
       
    this._userService.getSearchedDevotee(contact)
    .subscribe(userData => {
          console.log(userData);
        if(userData.result.length == 0){
            alert('No Data Found, Please add details');
            this.loading = false;
            this.devoteeData = {contact:contact};
        }else{
           this.devoteeData = userData.result[0];
           this.loading = false; 
        }
        
     });
    }
    
  }

  dStatus = {};
  devotees = [];  
  getOTPData = false;  
  
  
  counsellors = [
    {value:"HG Shyam Gopal Prabhuji"},
    {value:"HG Kalpvraksha Prabhuji"},
    {value:"HG Vaidant Chaitnya Prabhuji"},
    {value:"HG Pundrik Vidhyanidhi Prabhuji"},
    {value:"HG Jagdanand Pandit Prabhuji"},
    
  ];

  courses = [
    {value:"OTP"},
    {value: "TSSV"},
    {value: "ASHRAY1"},
    {value: "ASHRAY2"},
    {value: "OTHER"},
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
          this.showAddDevotee = true;
          this._getDevotees(params);
        }else if(params["course"] === "2"){
          console.log("in tssvb8 ");
          //this.showAddDevotee = false; 
          this._getDevotees(params);
        }else if (params["course"] === "3"){
          //this.showAddDevotee = false;  
          this._getDevotees(params);      
        }else if(params["course"] === "4"){
          //this.showAddDevotee = false;        
          this._getDevotees(params);        
        }else if(params["course"] === "5"){
          this.showAddDevotee = true;    
          this._getDevotees(params);    
        }
   });
    
  }



  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  _getDevotees(params){
    this._userService.getDevotees(params["course"])
    .subscribe(userData => {
//        console.log("user data is 2", userData);
        if(userData.sdlResult && userData.sdlResult.length > 0){
          this.dataSource.data = userData.result;
        }else if (!userData.sdlResult && userData.result.length > 0 && params["course"] == "5"){
            this.dataSource.data = userData.result;
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
        //data: {all:true}
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
                this.dStatus["speaker"] = userData.result[0].speaker;
                if(dv.contact){
                  this.dStatus["contact"] =  dv.contact
                  this._userService.markAttendance(this.dStatus)
                    .subscribe(userData => {
                      if(userData["result"] === "ok"){
                        swal("Attendance updated successfully" , "Hari Bol!!", 'success');
                      }else{
                        swal("Attendance already updated", "Hari Bol :)", 'warning');
                      }
                    });
                }
            }else{
              console.log("No class sdl for selected date");
              swal("No class sdl for selected date", "Hari Bol..", 'error')
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
          window.location.reload(); 
          swal("Hare Krishna, We have new devotee in IYF" , "Hari Bol!!", 'success');
         }else{
            swal("Hare Krishna, We already have this record" , "Hari Bol!", 'warning');
          }
         });
       }
    });
  }


  editDevoteeDialog(dv){
    console.log("id devotee",dv._id);
    let dialogRef = this.dialog.open(EditDevoteeComponent, {
      width: '400px',
      hasBackdrop: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if(result.dob){
        result.dob = this._userService.parseDate(result.dob);
        console.log("date is ", result.dob);
      }else{
       result.id = dv._id
       this._userService.editDevotee(result)
       .subscribe(userData => {
         console.log("Edit record is ", userData);
         if(userData["result"] === "ok"){
          swal("Record updated successfully" , "Hari Bol!!", 'success');          
          window.location.reload(); 
         }
        });
       }
    });
  }


  delRecord(dv){
      console.log("contact", dv.contact);
      this._userService.delRecord(dv.contact)
      .subscribe(userData => {
        console.log("del record is ", userData);
        if(userData["result"] === "ok"){
          console.log("in del record", userData);
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
  selector: 'edit-devotee',
  templateUrl: 'edit-devotee.html',
  styleUrls: ['./edit.devotee.css'],
  
})
export class EditDevoteeComponent {
  all = true;

  ngOnInit() {
    console.log("in edit devotee");
    
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  counsellors = [
    {value:"HG Shyam Gopal Prabhuji"},
    {value:"HG Kalpvraksha Prabhuji"},
    {value:"HG Vaidant Chaitnya Prabhuji"},
    {value:"HG Pundrik Vidhyanidhi Prabhuji"},
    {value:"HG Jagdanand Pandit Prabhuji"},
    
  ];

  courses = [
    {value: "OTP"},
    {value: "TSSV"},
    {value: "ASHRAY1"},
    {value: "ASHRAY2"},
    {value: "OTHER"},
  ];

  constructor(
    public dialogRef: MatDialogRef<MarkpresentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  
  updateDevotee(form:NgForm): void{
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

  all = false;
  ngOnInit() {
    console.log("in add devotee");
    this.route.queryParams.subscribe(params => {
      console.log("param is ", params['course']);

      if(params['course'] === "5"){
        this.all = true;
      };
    });
  }
  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  counsellors = [
    {value:"HG Shyam Gopal Prabhuji"},
    {value:"HG Kalpvraksha Prabhuji"},
    {value:"HG Vaidant Chaitnya Prabhuji"},
    {value:"HG Pundrik Vidhyanidhi Prabhuji"},
    {value:"HG Jagdanand Pandit Prabhuji"},
    
  ];

  courses = [
    {value: "OTP"},
    {value: "TSSV"},
    {value: "ASHRAY1"},
    {value: "ASHRAY2"},
    {value: "OTHER"},
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