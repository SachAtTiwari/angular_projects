import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {UserService} from './user.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [UserService]
})

export class HomeComponent{
  constructor(private _userService: UserService){};
}
