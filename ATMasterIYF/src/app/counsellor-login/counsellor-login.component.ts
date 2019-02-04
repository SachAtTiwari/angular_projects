import { Component, OnInit } from '@angular/core';
import { UserService} from '../devotee.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';
declare var jquery: any;
declare var $: any;
import { DataService } from '../data.service';
import {AppComponent} from '../app.component';



@Component({
  selector: 'app-counsellor-login',
  templateUrl: './counsellor-login.component.html',
  styleUrls: ['./counsellor-login.component.css'],
  providers: [
    UserService
  ]
})
export class CounsellorLoginComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private _userService: UserService,
    private _dataService: DataService,
    private router: Router, private appComp: AppComponent
   ) { }

  course = '';
  isLoggedIn = false;
  ngOnInit() {
    if ($(window).width() < 600) {
      $('.left-pane')[0].style.display = 'none';
    }

    if (this.appComp.isLoggedIn === true) {
    const getLoggedIn = localStorage.getItem('ctoken');
    console.log('getLogged in ', getLoggedIn);
    if (getLoggedIn) {
        this._userService.iscTokenVerified(getLoggedIn)
        .subscribe(tokenRes => {
           // console.log('data is 1', tokenRes);

            if (tokenRes.result === 'ok') {
              this.appComp.isLoggedIn = true;
              this.appComp.userName =  localStorage.getItem('cname');
            } else {
              this.router.navigateByUrl('/counLogin');
            }
        });
    }
  }
  }

  counLogin(form: NgForm): void {
    this._userService.counLogin(form.value)
    .subscribe(data => {
      if (data.result === 'ok') {
         // console.log('data is 2', data);

         localStorage.setItem('ctoken', data.token);
         localStorage.setItem('cname', form.value.username);
        // this._dataService.changeMessage(data.resources);
          this.router.navigateByUrl('/callingdetails/' + form.value.username);
          this.appComp.isLoggedIn = true;
          this.appComp.userName = form.value.username;
      } else {
          swal({

            type: 'error',
            title: 'Invalid Login Crdentials',
            html: 'Hari Bol:(',
            showConfirmButton: false,
            timer: 1500
        });
      }
    });
  }

}
