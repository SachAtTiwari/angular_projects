import { Component, OnInit,Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import {FormControl, Validators} from '@angular/forms';
import { UserService} from '../devotee.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';


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
  ngOnInit() {
    //id = this.route.snapshot.paramMap.get("id");
    this.route.params.subscribe(params => {
   // console.log(params['id']);
      this.id =  params["id"];
      //console.log("this id", this.id);
      this._userService.getDetails(this.id)
      .subscribe(userData => {
           console.log("user data is ", userData.result);
         });
       });    
  }

}
