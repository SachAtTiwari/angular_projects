const dbClient = require('mongodb').MongoClient;
const assert = require('assert');
var mongo = require('mongodb');

// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'users';


exports.addDevotee = function(req, res, next) {
    console.log("im here", req.body.body);
    let all = false    
    if(req.body.body.course && req.body.body.counsellor){
      all = true;
    }

    let date = new Date();
    let month = date.getMonth() + 1
    date =  date.getDate() + '-' + month + '-' + date.getFullYear();
    console.log("date is", date);

    dbClient.connect(url, function(err, client) {
        const db = client.db(dbName);
        db.listCollections().toArray(function(err, collections){
          if (collections === undefined){
            db.createCollection("devotees", function(err, res) {
              if (err) throw err;
                console.log("Collection created!");
             });
          }
  
          //const db = client.db("entity");
          db.listCollections().toArray(function(err, collections){
             if (collections === undefined){
                res.send({error:"No Classes Sdl for OTP"});
             }else{
              if(all){
                db.collection("devotees").find({contact:req.body.body.contact})
                .toArray(function(err, result) {
                   if (err) throw err;
                   if (result.length === 0){
                     db.collection("devotees")
                     .insertOne(req.body.body, function(err, createRes) {
                       if (err) throw err;
                       res.send({result:"ok"});
                     });
                   }else{
                     res.send({result:"notok"});            
                  }
                 }); 

              }else{
               //Find Sdl classes for today for given course to fetch counsellor details
                db.collection("entity").find({course:"OTP", date:date})
                .toArray(function(err, sdlResult) {
                  if (err) throw err;
                  req.body.body.fp = new Date();
                  req.body.body.course = sdlResult[0].course;
                  req.body.body.counsellor = sdlResult[0].speaker;

                  db.collection("devotees").find({contact:req.body.body.contact})
                  .toArray(function(err, result) {
                     if (err) throw err;
                     if (result.length === 0){
                       db.collection("devotees")
                       .insertOne(req.body.body, function(err, createRes) {
                         if (err) throw err;
                        let attendance = {
                          date:date, 
                          speaker:sdlResult[0].speaker,
                          topic:sdlResult[0].topic,
                          present:"YES"
                        }
                        db.collection("devotees").update(
                          {contact:req.body.body.contact}, 
                          {$push:{attendance:attendance}},
                          {upsert:false}, 
                          function(err, resatt) {
                            if (err) throw err;
                           // console.log("1 document find", res.result);
                            res.send({result:"ok"});
                           });
                      });
                     }else{
                       res.send({result:"notok"});            
                    }
                   }); 
                });
              }
          }
        });
      });
     });
  }

  exports.delRecord = function(req, res, next) {
    console.log("im here", req.query.contact);
    dbClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
  
      const db = client.db(dbName);
      db.listCollections().toArray(function(err, collections){     
        console.log("collection list". collections);
        if (collections === undefined){
          res.send({error:"No Collections present in DB"});
        }else{
          db.collection("devotees").deleteOne({contact:req.query.contact},
    
            function(err, res) {
              if (err) throw err;
              console.log("1 document deleted", res.result);
      
           });
        }
      });
    });
   res.send({result:"ok"});
};

exports.getDevotees = function(req, res, next) {
    console.log("i m here", req.query.course);
    let course = req.query.course;
    let date = new Date();
    let month = date.getMonth() + 1
    date =  date.getDate() + '-' + month + '-' + date.getFullYear();
    console.log("date is", date);
    

    dbClient.connect(url, function(err, client) {
        assert.equal(null, err);
        //check sdl classes for provided course
        const db = client.db(dbName);
        if(course){
         db.listCollections().toArray(function(err, collections){
           if (collections === undefined){
              res.send({error:"No Classes Sdl for OTP"});
           }else{
              db.collection("entity").find({course:course, date:date})
              .toArray(function(err, sdlResult) {
               if (err) throw err;
               //console.log("sdl result ",sdlResult);
                //GET OTP devotees 
                if (sdlResult){
                  //const db = client.db(dbName);      
                  db.listCollections().toArray(function(err, usrCollections){
                      if (usrCollections === undefined){
                        res.send({error:"No Collections present in DB"});
                      }else{
                         db.collection("devotees").find({course:course})
                         .toArray(function(err, result) {
                             if (err) throw err;
                             //console.log("devotee result", result);
                             res.send({result:result, sdlResult:sdlResult});
                          });
                      }
                   });
                }//OTP fetch finish
            });//Entity end
         }//else end
      });//list collection end
    }else{
      const db = client.db(dbName);      
      db.listCollections().toArray(function(err, usrCollections){
          if (usrCollections === undefined){
             res.send({error:"No Collections present in DB"});
          }else{
              db.collection("devotees").find()
              .toArray(function(err, result) {
               if (err) throw err;
               //console.log(result);
               res.send({result:result});
           });
          }
        });
    }
  });
  };

  exports.getDevoteeDetail = function(req, res, next) {
   // console.log("im here", req.query.id);
    dbClient.connect(url, function(err, client) {
        assert.equal(null, err);
        const db = client.db(dbName);
        db.listCollections().toArray(function(err, collections){
          if (collections === undefined){
            res.send({error:"No Collections present in DB"});
          }else{
            db.collection("devotees").find(
              { 
                _id: new mongo.ObjectID(req.query.id),
              }
           ).toArray(function(err, result) {
              if (err) throw err;
              //console.log(result);
              res.send({result:result});
          });
        }
      });
     });
  };