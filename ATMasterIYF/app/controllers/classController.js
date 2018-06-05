const assert = require('assert');
 

exports.markAttendance = function(req, res, next) {
  try{
    let db = req.app.locals.db;
    db.listCollections().toArray(function(err, collections){     
          if (collections === undefined){
            res.send({error:"No Collections present in DB"});
          }else{
            //Check if attendance already marked for the contact
            db.collection("devotees").find(
              { 
                contact:req.body.attendance.contact, 
                "attendance.date":req.body.attendance.date,  
              }
            ).toArray(function(err, result) {
              if (err) {
			          console.log("err is ", err);
                	res.send({error:500});
	            }else{
              if(result.length === 0){
                db.collection("devotees").update(
                  {contact:req.body.attendance.contact}, 
                  {$push:{attendance:req.body.attendance}},
                  {upsert:false}, 
                  function(err, resatt) {
                    if (err) {
			                console.log("err is ", err);
                      res.send({result:"notok"});
		                 }
                   // console.log("1 document find", res.result);
                    res.send({result:"ok"});
                 });
              }else{
                res.send({result:"notok"});
              }
	           }  
            });
          }
        });
      }catch(err){
        console.log("Exception :", err);
      }
}

//Check if class sdl for given course on selected date
exports.checkClassSdl = function(req, res, next) {
  try{
    console.log("check sdl class for date", req.query);
    let db = req.app.locals.db;
    
    db.listCollections().toArray(function(err, collections){
          if (collections === undefined){
            res.send({error:"No Collections present in DB"});
         }else{
            db.collection("entity").find(
            { 
              course:req.query.course, 
              date:req.query.date
            }
          ).toArray(function(err, result) {
            if (err) {
          			console.log("err is ", err);
                	res.send({error:500});
	          }else{
              console.log(result);
             res.send({result:result});
	          }
          });
        }
      });
    }catch(err){
      console.log("Exception:", err);
    }
  }

exports.sdlClass = function(req, res, next) {
  try{
    console.log("sdl class", req.body.body);
    let db = req.app.locals.db;
    db.listCollections().toArray(function(err, collections){
        console.log("collection list". collections);
        if (collections === undefined){
            db.createCollection("entity", function(err, res) {
              if (err) {
                  console.log("err is ", err);
                	res.send({error:500});
	            }
              //console.log("Collection created!");
             });
          }
  
          db.collection("entity").insertOne(req.body.body, function(err, sdResult) {
            if (err) {
		            console.log("err is ", err);
                res.send({result:"notok"});
	           }else{
          	  //console.log("1 document inserted", sdResult);
     	  	    res.send({result:"ok"});
	          }
         });
      });
    }catch(err){
      console.log("Exception:", err);
    }
  }

exports.getSdlClasses = function(req, res, next) {
  try{
    console.log("i m here in sdl classes");
    let db = req.app.locals.db;
    
    db.listCollections().toArray(function(err, collections){
          if (collections === undefined){
            res.send({error:"No Collections present in DB"});
         }else{
            db.collection("entity").find().sort({_id:-1}).toArray(function(err, result) {
              if (err) {
	            	console.log("err is ", err);
                res.send({result:"notok"});
	            }else{
                //console.log("result",result);
                res.send({result:result});
              }
            });
          }
      });
    }catch(err){
      console.log("Exception:", err);

    }
  };

exports.getTodayAttendance =  function(req, res, next) {
  try{
    console.log("today attendance", req.query);
    let date = new Date();
    let month = date.getMonth() + 1
    date =  date.getDate() + '-' + month + '-' + date.getFullYear();
    let db = req.app.locals.db;
  //  console.log("db is", db);
    
    db.listCollections().toArray(function(err, collections){
          if (collections === undefined){
              res.send({error:"No Collections present in DB"});
           }else{
              if (req.query.course === 'UMANG') {
                query = {
                  "attendance.date":date,  
                }
              }else {
                query = {
                  course:req.query.course, 
                  "attendance.date":date,  
                }
              }
              console.log('query is', query);
              db.collection("devotees").find(
              query
              ).toArray(function(err, result) {
                if (err) {
            			console.log("err is ", err);
                	res.send({erroe:500});
	            	}else{
                //console.log("result is ",result);
                res.send({result:result});
	            	}
              });
          }
     });
    }catch(err){
      console.log("Exception:", err);
    }
}
