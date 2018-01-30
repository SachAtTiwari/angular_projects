import {Injectable} from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { attachEmbeddedView } from '@angular/core/src/view/view_attach';



@Injectable()
export class UserService{
   private _url : string = "http://localhost:3000/";
   
   constructor(private _http: Http){}

  
   getOTPDevotees(){
    return this._http.get(this._url + "getOTPDevotees")  //, options)
      .map((response: Response) => {
         // console.log("mock data" , response);
          console.log("mock data 1 " , response.json());
          return response.json();
         }
       )
     }
   
 
   addDevotee(body){
      
     this._http.post(this._url + "addDevotee", {
        body: body
       })
        .subscribe(
          res => {
            console.log("res is", res);
          },
          err => {
            console.log("Error occured");
          }
        );
   }

   markAttendance(attendance){
    console.log("atten is ", attendance);
     this._http.post(this._url + "markAttendance", {
            attendance:attendance
       })
        .subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.log("Error occured");
          }
        );
   }


   downloadToExcel(dTe){
      console.log("atten is ", dTe.date);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');    
      let searchParams = new URLSearchParams();
      searchParams.append('date', dTe.date);
      searchParams.append('course', dTe.course);
      searchParams.append('counsellor', dTe.counsellor);
      let options = new RequestOptions({ headers: headers, params: searchParams });

      return this._http.get(this._url + "downloadToExcel", options)
          .map((response: Response) => {
             // console.log("mock data" , response);
            //console.log("mock data 1 " , response.json());
            return response.json();
         }
       )
   }
}