const dbClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
//const url = 'mongodb://localhost:27017';
const url = 'mongodb://iyfuser:h2so4na2co%23@ds253918.mlab.com:53918/iyfdb?authMode=scram-sha1';

 
// Database Name
const dbName = 'iyfdb';

exports.markAttendance = function(req, res, next) {
    dbClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
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
      });
}

//Check if class sdl for given course on selected date
exports.checkClassSdl = function(req, res, next) {
    console.log("im here", req.query.date);
    dbClient.connect(url, function(err, client) {
        const db = client.db(dbName);
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
     });
  }

exports.sdlClass = function(req, res, next) {
    console.log("im here", req.body.body);
    dbClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.listCollections().toArray(function(err, collections){
          console.log("collection list". collections);
          if (collections === undefined){
            db.createCollection("entity", function(err, res) {
              if (err) {
			console.log("err is ", err);
                	res.send({error:500});
	      }
              console.log("Collection created!");
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
     });
  }

exports.getSdlClasses = function(req, res, next) {
    console.log("i m here in sdl classes");
      dbClient.connect(url, function(err, client) {
//	console.log("errr in sdl", err)
        assert.equal(null, err);
        const db = client.db(dbName);
        db.listCollections().toArray(function(err, collections){
          if (collections === undefined){
            res.send({error:"No Collections present in DB"});
         }else{
            db.collection("entity").find().toArray(function(err, result) {
              if (err) {
		console.log("err is ", err);
                res.send({result:"notok"});
	      }else{
              console.log(result);
              res.send({result:result});
              }
            });
          }
        });
     });
  };

  exports.getTodayAttendance =  function(req, res, next) {
    console.log("i m here", req.query);
    dbClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.listCollections().toArray(function(err, collections){
          if (collections === undefined){
              res.send({error:"No Collections present in DB"});
           }else{
              db.collection("devotees").find(
              { 
                course:req.query.course, 
                "attendance.date":"17-3-2018",  
              }
              ).toArray(function(err, result) {
                if (err) {
            			console.log("err is ", err);
                	res.send({erroe:500});
	            	}else{
                console.log("result is ",result);
                res.send({result:result});
	            	}
              });
          }
        });
     });
}
