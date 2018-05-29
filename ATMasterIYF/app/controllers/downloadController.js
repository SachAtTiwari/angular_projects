const dbClient = require('mongodb').MongoClient;
const assert = require('assert');
 
exports.downloadToExcel =  function(req, res, next) {
  try{
    console.log("i m here", req.query);
    let db = req.app.locals.db;

    db.listCollections().toArray(function(err, collections){
        if (collections === undefined){
              res.send({error:"No Collections present in DB"});
        }else{
             db.collection("devotees").find(
              { 
                course:req.query.course, 
                "attendance.date":req.query.date,  
              }
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


exports.downloadToExCounsellor =  function(req, res, next) {
  try{
    console.log("i m here", req.query);
    let db = req.app.locals.db;

    db.listCollections().toArray(function(err, collections){
        if (collections === undefined){
              res.send({error:"No Collections present in DB"});
        }else{
             db.collection("devotees").find(
              { 
                course:req.query.course, 
                counsellor:req.query.counsellor,  
              }
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

exports.downloadCourseExcel =  function(req, res, next) {
  try{
    console.log("in course", req.query);
    let db = req.app.locals.db;

    db.listCollections().toArray(function(err, collections){
        if (collections === undefined){
              res.send({error:"No Collections present in DB"});
        }else{
             db.collection("devotees").find(
              { 
                course:req.query.course, 
              }
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

exports.checkDevoteeStatusForGivenDate = function(req, res, next){
  try{
    console.log("i m here", req.query);
    let db = req.app.locals.db;
    db.listCollections().toArray(function(err, collections){
      if (collections === undefined){
            res.send({error:"No Collections present in DB"});
      }else{
           db.collection("devotees").find(
            { 
              course:req.query.course, 
              counsellor:req.query.counsellor, 
              "attendance.date":req.query.date,  
            }
            ).toArray(function(err, result) {
              if (err) {
                console.log("err is ", err);
                res.send({erroe:500});
              }else{
              //console.log("result of devotee status ",result);
              res.send({result:result});
              }
            });
      }
  });
  }catch (err){
    console.log("Exception:", err);
  }

}