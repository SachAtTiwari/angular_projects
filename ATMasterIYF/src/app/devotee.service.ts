import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';



@Injectable()
export class UserService{
   private _url : string = "http://localhost:3000/";
   
   constructor(private _http: Http){}

  
   getAllDevotees(){
    return this._http.get(this._url + "getAllDevotees")  //, options)
      .map((response: Response) => {
          console.log("mock data" , response.json());
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

   markAttendance(contact){

     this._http.post(this._url + "markAttendance", {
            contact:contact,
            present:true
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

    

}