const assert = require('assert');
var mongo = require('mongodb');

exports.addDevoteeGeneric = function(req, res, next) {
  try{
  let db = req.app.locals.db;
  db.collection("devotees").find(
   {contact:req.body.body.contact})
  .toArray(function(err, dvData) {
      if (err) {
       console.log("err is ", err);
       res.send({result:"notok"});
       //if devotee not found add one with attendance
      }else{
        if (dvData.length === 0){
          db.collection("devotees")
          .insertOne(req.body.body, function(err, createRes) {
            if (err) {
               res.send({result:"notok"});
             }
            res.send({result:"ok"});
          });
        }else{
          res.send({result:"notok"});
        }
      }
    })
}catch(err){
  console.log("Exception :", err);
}

}

exports.addDevotee = function(req, res, next) {
  try{
    console.log("im here", req.body.body);
    let date = new Date();
    let month = date.getMonth() + 1;
    date =  date.getDate() + '-' + month + '-' + date.getFullYear();

    console.log("date is ", date);
    let db = req.app.locals.db;
    
    
    //Find Sdl classes for today for given course to fetch counsellor details
    db.collection("entity").find({course:req.body.body.course, date:date})
     .toArray(function(err, sdlResult) {
      if (err){
        console.log("err is ", err);
        res.send({result:"notok"});

      }else{
        console.log("in else ", sdlResult);
       
        db.collection("devotees").find(
          {contact:req.body.body.contact})
        .toArray(function(err, dvData) {
          if (err) {
           console.log("err is ", err);
           res.send({result:"notok"});
           //if devotee not found add one with attendance
          }else{
           
            console.log("res is",dvData);
            if (dvData.length === 0){
                
              req.body.body.fp = new Date();
              if (!req.body.body.course){
                 req.body.body.course = sdlResult[0].course;
              }
              if(!req.body.body.counsellor){ 
                req.body.body.counsellor = sdlResult[0].speaker;
              }
              let attendance = {
                  date:date, 
                  speaker:sdlResult[0].speaker,
                  topic:sdlResult[0].topic,
                  present:"YES"
              }
              req.body.body.attendance = [];
              req.body.body.attendance.push(attendance);
              db.collection("devotees")
              .insertOne(req.body.body, function(err, createRes) {
                if (err) {
                   res.send({result:"notok"});
                 }
                res.send({result:"ok"});
              });
              //if devotee found update it with whatever details it have without attendance
            }else{
              valuesToUpdate = {
                name:req.body.body.name,
                contact:req.body.body.contact,
                course:req.body.body.course,
                counsellor:req.body.body.counsellor,
                email:req.body.body.email,
                dob:req.body.body.dob
              }
              console.log("in update", valuesToUpdate);
              var query = {_id: new mongo.ObjectID(req.body.body._id)};
              var newvalues = { $set: valuesToUpdate };
              db.collection("devotees").update(
                query, newvalues, 
                function(err, resUp) {
                  if (err) {
                    res.send({result:"notok"})
                  }else{
                    console.log("document updated");
                    res.send({result:"updated"})
                  }
               });
           }
          }
       });

      }
    });
}catch(err){
  console.log("something went error", err);
}
}

exports.delRecord = function(req, res, next) {
  try{
    console.log("im here", req.query.contact);
    let db = req.app.locals.db;
    
    db.listCollections().toArray(function(err, collections){     
        console.log("collection list". collections);
        if (collections === undefined){
          res.send({error:"No Collections present in DB"});
        }else{
          db.collection("devotees").deleteOne({contact:req.query.contact},
    
            function(err, res) {
              if (err) {
		            console.log("err ", err)
                 res.send({error:500});            
	            }
              //console.log("1 document deleted", res.result);
      
           });
        }
    });
   res.send({result:"ok"});
  }catch(err){
    console.log("Exception ", err);
  }
};

exports.getDevotees = function(req, res, next) {
  try{
    console.log("i m here", req.query.course);
    let course = req.query.course;
    let date = new Date();
    let month = date.getMonth() + 1
    date =  date.getDate() + '-' + month + '-' + date.getFullYear();
    console.log("date is", date);
    let db = req.app.locals.db;
    if(course){
         db.listCollections().toArray(function(err, collections){
           if (collections === undefined){
              res.send({error:"No Classes Sdl for OTP"});
           }else{
              db.collection("entity").find({course:course, date:date})
              .toArray(function(err, sdlResult) {
               if (err) {
		            console.log("err ", err)
                 res.send({error:500});            
		            }else{
                console.log("sdl result ",sdlResult);
                //GET OTP devotees 
                if (sdlResult){
                  //const db = client.db(dbName);      
                  db.listCollections().toArray(function(err, usrCollections){
                      if (usrCollections === undefined){
                        res.send({error:"No Collections present in DB"});
                      }else{
                         db.collection("devotees").find({course:course})
                         .toArray(function(err, result) {
                         if (err) {
				                  console.log("err is ", err);
                		      res.send({error:500});
			                  }
                             //console.log("devotee result", result);
                        res.send({result:result, sdlResult:sdlResult});
                      });
                      }
                   });
                }//OTP fetch finish
		}
            });//Entity end
         }//else end
      });//list collection end
    }else{
      console.log("empty course");
      db.listCollections().toArray(function(err, usrCollections){
          if (usrCollections === undefined){
             res.send({error:"No Collections present in DB"});
          }else{
              db.collection("devotees").find()
              .toArray(function(err, result) {
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
    }
  }catch(err){
    console.log("Exception :", err);
  }
 };

exports.getDevoteeDetail = function(req, res, next) {
  try{
   // console.log("im here", req.query.id);
   let db = req.app.locals.db;
    
   db.listCollections().toArray(function(err, collections){
          if (collections === undefined){
            res.send({error:"No Collections present in DB"});
          }else{
            db.collection("devotees").find(
              { 
                _id: new mongo.ObjectID(req.query.id),
              }
           ).toArray(function(err, result) {
              if (err) {
		            	console.log("err is ", err);
                	res.send({error:500});
	            }else{
                //console.log(result);
                res.send({result:result});
	            }
          });
        }
      });
    }catch(err){
      console.log("Exception :", err);

    }
  };


exports.updateDevotee = function(req, res, next) {
  try{
    console.log("i m in update", req.body.body);
     var valuesToUpdate = {}
     if(req.body.body.contact){
        valuesToUpdate["contact"] = req.body.body.contact;
     }
     if(req.body.body.counsellor){
        valuesToUpdate["counsellor"] = req.body.body.counsellor;
     }
     if(req.body.body.age){
        valuesToUpdate["age"] = req.body.body.age;
     }
     if(req.body.body.dob){
        valuesToUpdate["dob"] = req.body.body.dob;
    }
    if(req.body.body.name){
        valuesToUpdate["name"] = req.body.body.name;
     }
     if(req.body.body.course){
        valuesToUpdate["course"] = req.body.body.course;
     } 
     if(req.body.body.email){
      valuesToUpdate["email"] = req.body.body.email;
    } 
    //console.log("value to update", valuesToUpdate);
    let db = req.app.locals.db;
    
    db.listCollections().toArray(function(err, collections){
        if (collections === undefined){
          res.send({error:"No Collections present in DB"});
         }else{
          var query = {_id: new mongo.ObjectID(req.body.body.id)};
          var newvalues = { $set: valuesToUpdate };
          db.collection("devotees").update(
             query, newvalues, 
             function(err, resUp) {
               if (err) {
                 res.send({result:"notok"})
               }else{
                 console.log("document updated");
                 res.send({result:"ok"})
               }
           });
        }
     });
    }catch(err){
      console.log("Exception:", err);
    }
};



exports.getSearchedDevotee = function(req, res, next) {
  try{
    console.log("i m insearched devotee", req.query);
   // console.log("db url", req.app.locals.db);
    let db = req.app.locals.db;
    db.listCollections().toArray(function(err, collections){
      if (collections === undefined){
        res.send({error:"No Collections present in DB"});
      }else{
      var regexp;
      var query = {};
      if(req.query.contact){
          regexp = new RegExp("^"+ req.query.contact);
          query = {contact:regexp, course:req.query.course}
      }else{
          regexp = new RegExp("^"+ req.query.email);
          query = {email:regexp, course:req.query.course}
          
      }
      db.collection("devotees").find(
        query
      ).toArray(function(err, result) {
        if (err) {
            console.log("err is ", err);
            res.send({result:"notok"});
        }else{
          //console.log(result);
          if(result.length == 0){
            let date = new Date();
            let month = date.getMonth() + 1;
            date =  date.getDate() + '-' + month + '-' + date.getFullYear();
            console.log("date is ", date);
            db.collection("entity").find({course:req.query.course, date:date})
            .toArray(function(err, sdlResult) {
              if (err){
                console.log("err is ", err);
                res.send({result:"notok"});
        
              }else{
                //console.log("sdl result is",sdlResult[0].speaker);
                if(sdlResult.length > 0){
                  res.send(
                  {sdlResult:[{course:req.query.course,counsellor:sdlResult[0].speaker}]}
                  )
                }else{
                  res.send({result:"notok"});
                }
              }
            })
          }else{
              res.send({result:result});
          }
        }
      });
      }
    });
  
  }catch(err){
    console.log("Exception :", err);

  }
};

