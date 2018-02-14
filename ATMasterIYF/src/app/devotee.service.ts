import {Injectable} from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { attachEmbeddedView } from '@angular/core/src/view/view_attach';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';



@Injectable()
export class UserService{
   private _url : string = "http://localhost:3000/";
   
   constructor(private _http: Http){}

  
   getOTPDevotees(){
     //console.log("options", options);
    return this._http.get(this._url + "getOTPDevotees")  //, options)
      .map((response: Response) => {
         // console.log("mock data" , response);
          //console.log("mock data 1 " , response.json());
          return response.json();
         }
       )
     }

   getSdlClasses(){
      return this._http.get(this._url + "getSdlClasses")  //, options)
        .map((response: Response) => {
           // console.log("mock data" , response);
            console.log("mock data 1 " , response.json());
            return response.json();
           }
         )
    }
   
   checkIfClassSdlForCourse(ckStatus): Observable<any> {
      //console.log("Checking class sdl");
      //console.log("atten is ", ckStatus.course);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');    
      let searchParams = new URLSearchParams();
      if(ckStatus.course === "1"){
        searchParams.append('course', "OTP");
      }else if(ckStatus.course === "2"){
        searchParams.append('course', "TSSV");
      }
      let options = new RequestOptions({ headers: headers, params: searchParams });
      /*return this._http.get(this._url + "checkClassSdl", options)
       .flatMap((response: Response) => response.json().result)
       .flatMap((otp: any) =>
        this._http.get(this._url + "getOTPDevotees", options), 
             (_, resp) => resp.json())*/
         
    
      return this._http.get(this._url + "checkClassSdl", options)
          .map((response: Response) => {
            //console.log("mock data 1 " , response.json());
            return response.json();
            //return {result :{"course":"OTP"}};
         }
       )
   }

   delRecord(contact):Observable <Response>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    let delParams = new URLSearchParams();
    delParams.append('contact', contact);
   
    let options = new RequestOptions({ headers: headers, params: delParams });


    return this._http.delete(this._url + "delRecord", options)
      .map(
        res => {
          console.log("res is", res);
          return res.json();
        },
        err => {
          console.log("Error occured", err);
          return err.json();
        }
      );
   }

   
   addDevotee(body): Observable<Response>{
      
     return this._http.post(this._url + "addDevotee", {
        body: body
       })
        .map(
          res => {
            console.log("res is", res);
            return res.json();
          },
          err => {
            console.log("Error occured");
            return err.json();
          }
        );
   }


   SdlClass(body){
    console.log("body is", body)  
    this._http.post(this._url + "sdlClass", {
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

   markAttendance(attendance): Observable<Response>{
    console.log("atten is ", attendance);
     return this._http.post(this._url + "markAttendance", {
            attendance:attendance
       })
        .map(
          res => {
            console.log(res);
            return res.json();
          },
          err => {
            console.log("Error occured", err);
            err.json();
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