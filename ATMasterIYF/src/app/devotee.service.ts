import {Injectable} from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { attachEmbeddedView } from '@angular/core/src/view/view_attach';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/mergeMap';
import { Body } from '@angular/http/src/body';



@Injectable()
export class UserService{
  private _url : string = "http://localhost:3000/";
  //private _url : string = "/";
   
   constructor(private _http: Http){}

  adminLogin(form){
    return this._http.post(this._url + "adminLogin", {
      body: form
     })
      .map(
        res => {
          return res.json();
        },
        err => {
          return err.json();
        }
      );
    }
  
  getOTPDevotees(){
    return this._http.get(this._url + "getOTPDevotees")  //, options)
      .map((response: Response) => {
          //console.log("mock data 1 " , response.json());
          return response.json();
         }
       )
     }
  
  getSearchedDevotee(contact){
      console.log("in searched", contact);
      let isContact = false;
      if(!isNaN(parseInt(contact))){
         isContact = true;
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');    
      let searchParams = new URLSearchParams();
      if(isContact == true){
        searchParams.append('contact', contact);
      }else{
        searchParams.append('email', contact);
        
      }
      searchParams.append('course', "OTP");
      let options = new RequestOptions({ headers: headers, params: searchParams });

      return this._http.get(this._url + "getSearchedDevotee", options)
        .map((response: Response) => {
            return response.json();
           }
         )
    }

  getDevotees(course): Observable<any>{
      let courseName = "";
      if(course == "1"){
        courseName = "OTP";
      }else if(course == "2"){
        courseName = "TSSV";        
      }else if(course == "3"){
        courseName = "ASHRAY1";                
      }else if(course == "4"){
        courseName = "ASHRAY2";                       
      }
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');    
      let searchParams = new URLSearchParams();
      searchParams.append('course', courseName);
      let options = new RequestOptions({ headers: headers, params: searchParams });

      return this._http.get(this._url + "getDevotees", options)
        .map((response: Response) => {
            //console.log("mock data 1 " , response.json());
            return response.json();
           }
         )
       }

  getDetails(id): Observable<any> {
    //  console.log("options", id);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');    
      let searchParams = new URLSearchParams();
      let token = localStorage.getItem('token');
      searchParams.append('id', id);
      searchParams.append('token', token);
      let options = new RequestOptions({ headers: headers, params: searchParams });
      
     return this._http.get(this._url + "getDetails", options)
       .map((response: Response) => {
           return response.json();
          }
        )
      }

  getSdlClasses(){
      
      return this._http.get(this._url + "getSdlClasses")
        .map((response: Response) => {
          //  console.log("mock data 1 " , response.json());
            return response.json();
           }
         )
    }
   
  checkIfClassSdlForCourse(course, date): Observable<any> {
      //console.log("Checking class sdl");
      //console.log("atten is ", ckStatus.course);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');    
      let searchParams = new URLSearchParams();
      searchParams.append('course', course);
      searchParams.append('date', date);
      let options = new RequestOptions({ headers: headers, params: searchParams });
      return this._http.get(this._url + "checkClassSdl", options)
          .map((response: Response) => {
            //console.log("mock data 1 " , response.json());
            return response.json();
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
            return res.json();
          },
          err => {
            return err.json();
          }
        );
   }

   addDevoteeGeneric(body): Observable<Response>{
      
    return this._http.post(this._url + "addDevoteeGeneric", {
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

  editDevotee(body): Observable<Response>{
    console.log("edit devotee", body);
    return this._http.put(this._url + "updateDevotee", {
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

   parseDate(date): string{

    var temp_datetime_obj = new Date(date);
    let month = temp_datetime_obj.getMonth() + 1
    date =  temp_datetime_obj.getDate() + '-' + month + '-' + temp_datetime_obj.getFullYear();
    //console.log("final date ", date); 
    return date;
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
      //console.log("atten is ", dTe);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');    
      let searchParams = new URLSearchParams();
      searchParams.append('date', dTe.date);
      searchParams.append('course', dTe.course);
      searchParams.append('counsellor', dTe.counsellor);
      let options = new RequestOptions({ headers: headers, params: searchParams });

      return this._http.get(this._url + "downloadToExcel", options)
          .map((response: Response) => {
            //console.log("mock data 1 " , response.json());
            return response.json();
         }
       )
   }

   downloadToExCounsellor(dTe){
    //console.log("atten is ", dTe);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    let searchParams = new URLSearchParams();
    searchParams.append('date', dTe.date);
    searchParams.append('course', dTe.course);
    searchParams.append('counsellor', dTe.counsellor);
    let options = new RequestOptions({ headers: headers, params: searchParams });

    return this._http.get(this._url + "downloadToExCounsellor", options)
        .map((response: Response) => {
          //console.log("mock data 1 " , response.json());
          return response.json();
       }
     )
 }

   getTodayAttendance(course){
    //console.log("atten is ", dTe);
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    let searchParams = new URLSearchParams();
    searchParams.append('course', course);
    let options = new RequestOptions({ headers: headers, params: searchParams });

    return this._http.get(this._url + "getTodayAttendance", options)
        .map((response: Response) => {
          return response.json();
       }
     )
 }
}