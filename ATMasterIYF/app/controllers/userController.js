const assert = require('assert');
var mongo = require('mongodb');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var cLogin = require('./counsellorLogin');

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


exports.adminLogin = function(req, res, next) {
  try{
  
  let db = req.app.locals.db;
  db.collection("devotees").find(
   {username:req.body.body.username})
  .toArray(function(err, dvData) {
      if (err) {
       console.log("err is ", err);
       res.send({result:"notok"});
      }else{
        if(dvData.length > 0 && 
          bcrypt.compareSync(req.body.body.password, dvData[0].password)){
            let token = jwt.sign({user:dvData}, 'khsandasinasfnasiu2194u19u41142i210',
            {expiresIn:900});
            res.status(200).json({
              result:"ok",
              message:"Logged in Successfully",
              token:token,
              userId: dvData._id,
            })
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
    console.log("i m here", req.query);
    let skip = 0;
    let limit = 10;
    if(req.query.skip){
      skip = req.query.skip;
    }
    if(req.query.limit){
      limit = req.query.limit;
    }
    let course = req.query.course;
    let date = new Date();
    let month = date.getMonth() + 1
    date =  date.getDate() + '-' + month + '-' + date.getFullYear();
    //console.log("date is", date);
    let db = req.app.locals.db;
    let isLoggedIn = false;


    /*if(req.query.token){
      let decoded = jwt.verify(req.query.token,'khsandasinasfnasiu2194u19u41142i210');
      if (decoded.user.length > 0){
        isLoggedIn = true;
      }  
    }*/
  
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
                         db.collection("devotees").find({course:course}).skip(skip).limit(limit)
                         .toArray(function(err, result) {
                         if (err) {
				                  console.log("err is ", err);
                		      res.send({error:500, isLoggedIn:isLoggedIn});
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
              db.collection("devotees").find().sort({name:1})
              .toArray(function(err, result) {
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
    }
  }catch(err){
    console.log("Exception :", err);
  }
 };

exports.getDevoteeDetail = function(req, res, next) {
  try{
    console.log("im here", req.query, cLogin.secret);
   let db = req.app.locals.db;
   if (req.header('token')) {
      var decoded = jwt.verify(req.header('token'), 'khsandasinasfnasiu2194u19u41142i210');
   }

   if (req.header('ctoken')) {
      var decoded = jwt.verify(req.header('ctoken'), cLogin.secret);
   }
  
   if(decoded.user.length > 0){
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
    }else{
        res.send({result:"notok", message:'not authenticated'});
      
    }
    }catch(err){
      console.log("Exception :", err);

    }
  };


exports.updateDevotee = function(req, res, next) {
  try{
    console.log("i m in update", req.body.body);
    console.log("id is ", req.body.body._id);
     var valuesToUpdate = {}
     if(req.body.body.contact){
        valuesToUpdate["contact"] = req.body.body.contact;
     }
     if(req.body.body.counsellor){
        valuesToUpdate["counsellor"] = req.body.body.counsellor;
     }
     if(req.body.body.contact2){
      valuesToUpdate["contact2"] = req.body.body.contact2;
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
    if(req.body.body.bace){
      valuesToUpdate["bace"] = req.body.body.bace;
    } 
    if(req.body.body.area){
      valuesToUpdate["area"] = req.body.body.area;
    } 
    if(req.body.body.isAlumni){
      valuesToUpdate["isAlumni"] = req.body.body.isAlumni;
    }

    if(req.body.body.facilitator){
      valuesToUpdate["facilitator"] = req.body.body.facilitator;
    }

    console.log("value to update", valuesToUpdate);
    let db = req.app.locals.db;
    
    db.listCollections().toArray(function(err, collections){
        if (collections === undefined){
          res.send({error:"No Collections present in DB"});
         }else{
          var query = {_id: new mongo.ObjectID(req.body.body._id)};
          var newvalues = { $set: valuesToUpdate };
          db.collection("devotees").update(
             query, newvalues, 
             function(err, resUp) {
               if (err) {
                 console.log("err is", err);
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
    
      query = {
        course:req.query.course,
        "$or":[
           {contact:req.query.contact},
           {contact2:req.query.contact}
         ]
      }
      if (req.query.course === "UMANG") {
        query = {
          contact:req.query.contact
        }
      }
      console.log("query is", query);
     
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

exports.isTokenVerified = function(req, res, next) {
    try{
        // console.log("token is verified ", req.header('Authorization').split(" "));
        let db = req.app.locals.db;
        jwt.verify(req.header('Authorization').split(" ")[1], 'khsandasinasfnasiu2194u19u41142i210',
        function(err, decoded){
          if(err){
            // respond to request with error
            console.error("err in verification", err);
            res.send({result:"notok"})
            
          }else{
            // continue with the request
            if(decoded.user.length > 0){
                res.send({result:"ok"})
            }else{
              res.send({result:"notok"})
            }
          }
        });
        

    }catch(err){
      console.log("Exception :", err);
//      res.send({result:"notok"})
      
  }
}
