import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import swal from 'sweetalert2';
import {MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import { collectExternalReferences } from '@angular/compiler/src/output/output_ast';
import { resetFakeAsyncZone } from '@angular/core/testing';


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

  contact:string;
  launchModal = false;
  showAddDevotee = false;
  formError = "";
  topic = "";
  devoteeData = {contact:''};
  loading = false;
  con = "";
  values = '';
  showAllSwitch = true;

  dStatus = {};
  devotees = [];  
  getOTPData = false;  
  isLoggedIn = false;
  email = new FormControl('', [Validators.required, Validators.email]);
  
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

 
  getPageDetails(e) {
    console.log(e.pageSize);
    this._getDevotees({course:5});  
  }
  getSearchedDevotee(contact){
    this.loading = true;
    if(contact != undefined && contact.length != 10){
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
 
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }

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



  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  _getDevotees(params){
    let getLoggedIn = localStorage.getItem("token");
    console.log("token is in atte init",getLoggedIn);
    this._userService.getDevotees(params["course"], getLoggedIn)
    .subscribe(userData => {
      console.log("in get devotees", userData);
      this.isLoggedIn = userData.isLoggedIn;
       if(userData.result){
         userData.result = userData.result.filter(function(el) {
            return el.username !== "admin";
         });
        }
       console.log("user data is 2", userData);
        
       /* if(userData.sdlResult && userData.sdlResult.length > 0 && params["course"] == "1"){
          this.router.navigateByUrl('/otpAttendance');
        }*/
        if(userData.sdlResult && userData.sdlResult.length > 0){
          this.dataSource.data = userData.result;
        }else if (!userData.sdlResult && userData.result.length >= 0 && params["course"] == "5"){
            console.log("in course 5");
            this.showAllSwitch = false;
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
                          swal({

                              type: 'success',
                              title: 'Attendance updated successfully',
                              html: "Hari Bol!!",
                              showConfirmButton: false,
                              timer: 1500
                          })
                        //swal("" , "Hari Bol!!", 'success');
                      }else{
                          swal({

                              type: 'warning',
                              title: 'Attendance already updated',
                              html: "Hari Bol!!",
                              showConfirmButton: false,
                              timer: 1500
                          })
                        //swal("", "Hari Bol :)", 'warning');
                      }
                    });
                }
            }else{
              console.log("No class sdl for selected date");
             // swal("", "Hari Bol..", 'error')
              swal({

                  type: 'error',
                  title: 'No class sdl for selected date',
                  html: "Hari Bol!!",
                  showConfirmButton: false,
                  timer: 1500
              })
            }
          });

    });
    
  }


  handleDevoteeDialog(){
    let dialogRef = this.dialog.open(AddDevoteeComponent, {
      width: '500px',
      height:'100px;',
      hasBackdrop: false,
      //data: { contact:this.contact }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);

      //result.dob = this._userService.parseDate(result.dob);
      //console.log("date is ", result.dob);

      if (!result.name || !result.email 
        || !result.contact || !result.dob 
        || !result.counsellor || !result.course){
          this.formError = "All fields are mandatory";
      }else{
        
       this._userService.addDevoteeGeneric(result)
       .subscribe(userData => {
         console.log("Add record is ", userData);
         if(userData["result"] === "ok"){
          console.log("in add record", userData);
          window.location.reload(); 
          //swal("Hare Krishna, We have new devotee in IYF" , "Hari Bol!!", 'success');
          swal({

              type: 'success',
              title: 'Hare Krishna, We have new devotee in IYF',
              html: "Hari Bol!!",
              showConfirmButton: false,
              timer: 1500
          }) 
         }else{
            //swal("Hare Krishna, We already have this record" , "Hari Bol!", 'warning');
            swal({

              type: 'warning',
              title: 'Hare Krishna, We already have this record',
              html: "Hari Bol!!",
              showConfirmButton: false,
              timer: 1500
          }) 
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
      } 
      result._id = dv._id;
       this._userService.editDevotee(result)
       .subscribe(userData => {
         console.log("Edit record is ", userData);
         if(userData["result"] === "ok"){
          //swal("Record updated successfully" , "Hari Bol!!", 'success');
          swal({

              type: 'success',
              title: 'Record updated successfully',
              html: "Hari Bol!!",
              showConfirmButton: false,
              timer: 1500
          })          
         // window.location.reload(); 
         }
        });
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
  selector: 'main-attendance',
  templateUrl: 'main-attendance.html',
  styleUrls: ['./main-attendance.css'],
  providers: [
    UserService,
  ]

})
export class MainAttendanceComponent {
  startDate = new Date(1987, 0, 1);  
  contact:string;
  devoteeData = {contact:'', contact2:'', counsellor:'',course:'', email:'',dob:'',name:''};
  loading = false;
  dStatus = {};
  attendanceArray = [];  
  displayedColumns = ['Name', 'Contact', 'Attendance'];
  dataSource = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

    ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  constructor(private route: ActivatedRoute,
    public dialog: MatDialog, 
    private _userService:UserService,
    private router: Router,
    public snackBar: MatSnackBar) {
      console.log("in constructor");
    };
  isLoggedIn = false;
  ngOnInit()  {

      let getLoggedIn = localStorage.getItem("token");
   // console.log("token is in atte init",getLoggedIn);
    if(getLoggedIn){
        this._userService.isTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
            console.log("token res", tokenRes);
            if(tokenRes.result == "ok"){
              this.isLoggedIn = true;
            }else{
              localStorage.clear();
            }
        })

      console.log("im main attendance");
      let course = "OTP";
      let todayDate = new Date();
      let todayDateNew = this._userService.parseDate(todayDate);
      this._userService.checkIfClassSdlForCourse(course, todayDateNew)
      .subscribe(sdlresult => {
         //console.log("sdl result is", sdlresult);
         if(sdlresult.result.length == 0){
            this.router.navigateByUrl('/classSdl');
         }
      })

      this._userService.getTodayAttendance(course)
      .subscribe(userData => {
          if(userData.result.length != 0){
         // console.log(userData.result);
          let result_json = [];
          for(var i = 0;i < userData.result.length;i++){
            let objectToShow = {};
            
            objectToShow["name"] = userData.result[i].name;
            objectToShow["contact"] = userData.result[i].contact;
          //console.log("result i ", userData.result[i].attendance, todayDateNew);
            
            for(var j = 0;j < userData.result[i].attendance.length;j++){
              if(userData.result[i].attendance[j].date.localeCompare(todayDateNew) == 0){
                objectToShow["date"] = userData.result[i].attendance[j].date;
                objectToShow["attendance"] = userData.result[i].attendance[j].present;
                objectToShow["topic"] = userData.result[i].attendance[j].topic;
                objectToShow["speaker"] = userData.result[i].attendance[j].speaker;
                break;
              }
   
           }
           //console.log("object to show", objectToShow);
          result_json.push(objectToShow);
          }
        this.attendanceArray = result_json;
        this.dataSource.data = this.attendanceArray;
          
        }
       });
    }
  }

    _searchedDevotee(contact, isContact){
      this._userService.getSearchedDevotee(contact)
      .subscribe(userData => {
           console.log("searched data is ",userData);
          if(userData.sdlResult){
              //swal('', "Hari Bol!", "error");
              swal({

                  type: 'error',
                  title: 'No Data Found, Please add details',
                  html: "Hari Bol!!",
                  showConfirmButton: false,
                  timer: 1500
              })
              this.loading = false;
              if(isContact){
                this.devoteeData = {contact:contact,contact2:'',
                course:userData.sdlResult[0].course, 
                counsellor:userData.sdlResult[0].counsellor,
                email:'',dob:'', name:''};
              }else{
                this.devoteeData = {email:contact,contact2:'', 
                course:userData.sdlResult[0].course, 
                counsellor:userData.sdlResult[0].counsellor,
                contact:'', dob:'', name:''};
              }
          }else if(userData.result == "notok"){
  
            //swal('Class not scheduled for OTP', "Hari Bol!", "error");
            swal({

                  type: 'error',
                  title: 'Class not scheduled for OTP',
                  html: "Hari Bol!!",
                  showConfirmButton: false,
                  timer: 1500
              })
            this.loading = false; 
          }else{
            this.devoteeData = userData.result[0];
            console.log("devotee data", this.devoteeData);
            this.loading = false; 
          }
      });
    }


    getSearchedDevotee(contact){
     // console.log("contact is", parseInt(contact));
      this.loading = true;
      let isContact = false;
      if(!isNaN(parseInt(contact))){
       //   console.log("contact is", contact);
          if(contact.length != 10 && contact != undefined){
             // swal("Invalid mobile no" , "Hari Bol", 'error'); 
              swal({

                  type: 'error',
                  title: 'Invalid mobile no',
                  html: "Hari Bol!!",
                  showConfirmButton: false,
                  timer: 1500
              })         
              this.loading = false;
          }else if(contact.length == 10 && contact != ""){
              isContact = true;
              this._searchedDevotee(contact, isContact);  
          }
      }else{
        this._searchedDevotee(contact, isContact);           
          
       }
      
    }
    
    addDevotee(devoteeForm) {
      // console.log("devotee form is", devoteeForm.value);
       if (!devoteeForm.value.name || !devoteeForm.value.email 
        || !devoteeForm.value.contact || !devoteeForm.value.dob 
        || !devoteeForm.value.course || !devoteeForm.value.counsellor){
          //swal("All fields are mandatory", "", "error");
          swal({

                  type: 'error',
                  title: 'All fields are mandatory',
                  html: "",
                  showConfirmButton: false,
                  timer: 1500
              }) 
       }else{
       console.log("dev data",this.devoteeData) 
       //console.log("dev data submit",this.devoteeDataSubmit); 
        this.loading = true;
        this._userService.getSearchedDevotee(this.devoteeData.contact)
        .subscribe(userData => {
          console.log("user data is ", userData);
          
          let valuesToUpdate = {}
          let misMatch = false;
          if(userData.result && userData.result.length !== 0 ){
            if(userData.result[0].contact !== this.devoteeData.contact){
                valuesToUpdate["contact"] = this.devoteeData.contact;
                misMatch = true;
            }
            if(userData.result[0].name !== this.devoteeData.name){
                valuesToUpdate["name"] = this.devoteeData.name;
                misMatch = true;

            }
            if(userData.result[0].contact2 !== this.devoteeData.contact2){
              valuesToUpdate["contact2"] = this.devoteeData.contact2;
              misMatch = true;
            }
            if(userData.result[0].email !== this.devoteeData.email){
              valuesToUpdate["email"] = this.devoteeData.email;
              misMatch = true;
            }
            if(userData.result[0].dob !== this.devoteeData.dob){
              valuesToUpdate["dob"] = this.devoteeData.dob;
              misMatch = true;
            }
            if(userData.result[0].counsellor !== this.devoteeData.counsellor){
              valuesToUpdate["counsellor"] = this.devoteeData.counsellor;
              misMatch = true;
            }
            if(userData.result[0].course !== this.devoteeData.course){
              valuesToUpdate["course"] = this.devoteeData.course;
              misMatch = true;
            }

            if(misMatch){
              console.log("mismatch ", valuesToUpdate);
              let YES = "YES";
              let NO = "NO";
              let dialogRef = this.dialog.open(EditDevoteeConfirm, {
                width: '280px',
                data: { YES: YES, NO:NO, update:valuesToUpdate}
              });
          
              dialogRef.afterClosed().subscribe(result => {
               console.log('The dialog was closed', result);

               if (result === "YES"){
                valuesToUpdate["_id"] = userData.result[0]._id;
                this._userService.editDevotee(valuesToUpdate)
                .subscribe(editData => {
                  console.log("Edit record is ", editData);
                  if(editData["result"] === "ok"){
                    //swal("" , "Hari Bol!!", 'success');
                    swal({

                        type: 'success',
                        title: 'Record updated successfully',
                        html: "",
                        showConfirmButton: false,
                        timer: 1500
                    })     
                    this.loading = false;      
                    devoteeForm.reset();
                  }else{
                    //swal("Problem in updating record" , "Hari Bol!!", 'error'); 
                    swal({

                        type: 'error',
                        title: 'Problem in updating record',
                        html: "Hari Bol!!",
                        showConfirmButton: false,
                        timer: 1500
                    })    
                    this.loading = false;      
                  }
                  });
               }else{
                 this.loading = false;
               }
              });
                
            }else{
              console.log("going to mark attendance only no updates", devoteeForm.value);
              this.markAttendance(devoteeForm);
              
            }
          }else{
              console.log("add devotee");
              this._userService.addDevotee(this.devoteeData)
              .subscribe(addData => {
              console.log("Add record is ", addData);
                if(addData["result"] === "ok"){
                  //swal("Hare Krishna, We have new devotee in IYF" , "Hari Bol!!", 'success');
                  swal({

                        type: 'success',
                        title: 'Hare Krishna, We have new devotee in IYF',
                        html: "Hari Bol!!",
                        showConfirmButton: false,
                        timer: 1500
                    }) 
                  this.loading = false;
                  this.attendanceArray.push(
                    { 
                      name: this.devoteeData['name'],
                      contact: this.devoteeData['contact'],
                      attendance: 'YES' 
                    })
                  this.dataSource.data = this.attendanceArray;
               }else if(addData["result"] == "updated"){
                // swal("Hare Krishna, Devotee details are updated" , "Hari Bol!", 'success');
                  this.loading = false;
                }else{
                  //swal("Hare Krishna, Something went wrong, Please try again" , "Hari Bol!", 'success');
                  swal({

                        type: 'success',
                        title: 'Hare Krishna, Something went wrong, Please try again',
                        html: "Hari Bol!!",
                        showConfirmButton: false,
                        timer: 1500
                    })
                    this.loading = false;

                }
              });  
          }
          
        });
        
      }
    }
    
    
    todayDate = new Date();
    month = this.todayDate.getMonth()+1;
    markAttendance(form) {
       //console.log("mark attendance", form);
       if(form.invalid != true) {
          this.loading = true;
          let date = this.todayDate.getDate() + "-" + this.month + "-" + this.todayDate.getFullYear();
          this._userService.checkIfClassSdlForCourse(this.devoteeData['course'], date)
          .subscribe(userData => {
           // console.log("user data is ", userData.result);
            if (userData.result.length > 0){

                this.dStatus["date"] = userData.result[0].date;
                this.dStatus["present"] = "YES";
                this.dStatus["topic"] = userData.result[0].topic;
                this.dStatus["speaker"] = userData.result[0].speaker;
                if(this.devoteeData.contact){
                  this.dStatus["contact"] =  this.devoteeData.contact
                  this._userService.markAttendance(this.dStatus)
                    .subscribe(userData => {
                        
                      if(userData["result"] === "ok"){
                        this.loading = false;              
                        //swal("Attendance updated successfully" , "Hari Bol!!", 'success');
                        swal({

                            type: 'success',
                            title: 'Attendance updated successfully',
                            html: "Hari Bol!!",
                            showConfirmButton: false,
                            timer: 1500
                        }) 
                        console.log("attendance array", this.attendanceArray);
                            this.attendanceArray.push(
                              { 
                                name: this.devoteeData['name'],
                                contact: this.devoteeData['contact'],
                                attendance: 'YES' 
                              })
                         this.dataSource.data = this.attendanceArray;
                      }else{
                         /* if (this.attendanceArray.length == 0) {
                              this.attendanceArray.push(
                                { 
                                  name: this.devoteeData['name'],
                                  contact: this.devoteeData['contact'], 
                                  attendance: 'Yes'
                                 })
                          }*/          
                           //swal("Attendance already updated", "Hari Bol :)", 'warning');
                           swal({

                               type: 'warning',
                               title: 'Attendance already updated',
                               html: "Hari Bol!!",
                               showConfirmButton: false,
                               timer: 1500
                           }) 
                          this.dataSource.data = this.attendanceArray;
                          this.loading = false;              
                        
                      }
                      
                      /*let obj = {};
                      for (let i in this.attendanceArray) {
                          this.attendanceArray.push({ name: this.devoteeData['name'], contact: this.devoteeData['contact'], attendance: 'Yes' })
                          if (!obj[this.attendanceArray[i].contact]) {
                              obj[this.attendanceArray[i].contact] = this.attendanceArray[i]
                          }
                          var filterArray = [];
                          for (let key in obj) filterArray.push(obj[key]);
                      } 
                        
                      this.dataSource.data = filterArray;*/
                    });
                }
            }else{
               this.loading = false;              
              console.log("No class sdl for selected date");
              //swal("No class sdl for selected date", "Hari Bol..", 'error')
              swal({

                  type: 'error',
                  title: 'No class sdl for selected date',
                  html: "Hari Bol!!",
                  showConfirmButton: false,
                  timer: 1500
              }) 
            }
          });
           
      } 
    }

}


@Component({
  selector: 'edit-devotee',
  templateUrl: 'edit-devotee.html',
  styleUrls: ['./edit.devotee.css'],
  
})
export class EditDevoteeComponent {
  startDate = new Date(1987, 0, 1);   
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
  selector: 'edit-devotee',
  templateUrl: 'edit-confirm.html',
  styleUrls: ['./edit-confirm.css'],
  
})

export class EditDevoteeConfirm {

  ngOnInit() {
    console.log("in edit devotee");
    
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  getErrorMessage() {
    return this.email.hasError('required') ? 'You must enter a value' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  constructor(
    public dialogRef: MatDialogRef<MarkpresentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(no): void {
    this.dialogRef.close(no);
  }

}

@Component({
  selector: 'add-devotee',
  templateUrl: 'add-devotee.html',
  styleUrls: ['./add-devotee.css'],
  
 
})
export class AddDevoteeComponent {

  all = false;
  startDate = new Date(1987, 0, 1);
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
