import { Component, OnInit,Inject, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import {MatTableDataSource, MatPaginator, MatSort} from '@angular/material';



@Component({
  selector: 'app-showdetails',
  templateUrl: './showdetails.component.html',
  styleUrls: ['./showdetails.component.css'],
  providers: [UserService]

})
export class ShowdetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog, 
    private _userService:UserService,
    private router: Router) { }

  id : string;
  displayedColumns = ['Date', 'Speaker', 'Topic', 'Attendance'];
  dataSource = new MatTableDataSource([]);
  devoteeData = {contact:'', counsellor:'',course:'', email:'',dob:'',name:''};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  isLoggedIn = false;
  ngOnInit() {
    this.dataSource.paginator = this.paginator;
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

    this.route.params.subscribe(params => {
      this.id =  params["id"];
      //console.log("this id", this.id);
      this._userService.getDetails(this.id)
      .subscribe(userData => {
           console.log("user data is ", userData.result);
           if(userData.result[0].attendance){
            this.dataSource.data = userData.result[0].attendance;
           }
           this.devoteeData = userData.result[0];
         });
       });    
  }
}

}
