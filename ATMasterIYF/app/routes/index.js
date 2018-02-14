var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'users';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



router.post('/markAttendance', function(req, res, next) {
  console.log("im here", req.body.attendance.contact);
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    db.listCollections().toArray(function(err, collections){     
      console.log("collection list". collections);
      if (collections === undefined){
        res.send({error:"No Collections present in DB"});
      }else{
        db.collection("devotees").update({contact:req.body.attendance.contact}, 
          {
            $push:{attendance:req.body.attendance}
          },
          {
              upsert:false
          }, 
          function(err, res) {
            if (err) throw err;
            console.log("1 document find", res.result);
    
         });
      }
    });
  });
 res.send({result:"ok"});
  

});

router.delete('/delRecord', function(req, res, next) {
  console.log("im here", req.query.contact);
  MongoClient.connect(url, function(err, client) {
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
  

});



/* add Devotee */
router.post('/addDevotee', function(req, res, next) {
  console.log("im here", req.body.body);
  //console.log(connectDb());
  MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
  
      const db = client.db(dbName);
      db.listCollections().toArray(function(err, collections){
        //collections = [{"name": "coll1"}, {"name": "coll2"}]
          console.log("collections", collections);
       
      console.log("collection list". collections);
      if (collections === undefined){
        db.createCollection("devotees", function(err, res) {
          if (err) throw err;
            console.log("Collection created!");
          //  db.close();
         });
      }
      req.body.body.fp = new Date();
    //  req.body.body.course = "OTP";

      db.collection("devotees").findOne(req.body.body.contact, function(err, res) {
        if (err) throw err;
        console.log("1 document find", res.result);
        if (res.result.length == 0){
          db.collection("devotees").insertOne(req.body.body, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted", res.result);
            res.send({result:"ok"});
           });
        }else{
           res.send({result:"notok"});
            
        }
       });
      
      //db.close();
    });
   });
   
});


/* Sdl Class */
router.post('/sdlClass', function(req, res, next) {
  console.log("im here", req.body.body);
  //console.log(connectDb());
  MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
  
      const db = client.db("entity");
      db.listCollections().toArray(function(err, collections){
        //collections = [{"name": "coll1"}, {"name": "coll2"}]
          console.log("collections", collections);
       
      console.log("collection list". collections);
      if (collections === undefined){
        db.createCollection("entity", function(err, res) {
          if (err) throw err;
            console.log("Collection created!");
          //  db.close();
         });
      }

      db.collection("entity").insertOne(req.body.body, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted", res.result);
        //db.close();
      //  res.send({status:res.result});
       });
      //db.close();
    });
   });
   res.send({status:"ok"});
   
});


/* GEt OTP Devotee */
router.get('/getOTPDevotees', function(req, res, next) {
  console.log("im here", req.body.body);
  //console.log(connectDb());
  MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
  
      const db = client.db(dbName);
      db.listCollections().toArray(function(err, collections){
        //collections = [{"name": "coll1"}, {"name": "coll2"}]
          console.log("collections", collections);
       
      console.log("collection list". collections);
      if (collections === undefined){
        res.send({error:"No Collections present in DB"});
      }else{
        db.collection("devotees").find({course:'OTP'}).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          //db.close();
          res.send({result:result});
        });
      }

    });
   });
   
});


/* GEt OTP Devotee */
router.get('/getSdlClasses', function(req, res, next) {
  console.log("im here", req.body.body);
  //console.log(connectDb());
  MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
  
      const db = client.db("entity");
      db.listCollections().toArray(function(err, collections){
        //collections = [{"name": "coll1"}, {"name": "coll2"}]
          console.log("collections", collections);
       
      console.log("collection list". collections);
      if (collections === undefined){
        res.send({error:"No Collections present in DB"});
      }else{
        db.collection("entity").find().toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          //db.close();
          res.send({result:result});
        });
      }

    });
   });
   
});


router.get('/downloadToExcel', function(req, res, next) {
  var temp_datetime_obj = new Date(req.query.date);
  console.log(temp_datetime_obj.toISOString());
  query_date = temp_datetime_obj.toISOString();
  console.log("query date ", query_date);
 // console.log("im here", req.params);
  
  //console.log(connectDb());
  MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
  
      const db = client.db(dbName);
      db.listCollections().toArray(function(err, collections){
        //collections = [{"name": "coll1"}, {"name": "coll2"}]
          console.log("collections", collections);
       
      console.log("collection list". collections);
      if (collections === undefined){
        res.send({error:"No Collections present in DB"});
      }else{
        //db.runCommand({ profile : 2 })
        db.collection("devotees").find(
          { 
            course:req.query.course, 
            counsellor:req.query.counsellor,
            "attendance.date":"2018-02-16T18:30:00.000Z",  
          }
        ).toArray(function(err, result) {
          if (err) throw err;
          console.log("result is ",result);
          //db.close();
          res.send({result:result});
        });
      }

    });
   });
   
});



router.get('/checkClassSdl', function(req, res, next) {
  console.log("im here", req.query.date);
 // console.log("im here", req.params);
  
  //console.log(connectDb());
  MongoClient.connect(url, function(err, client) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
  
      const db = client.db("entity");
      db.listCollections().toArray(function(err, collections){
        //collections = [{"name": "coll1"}, {"name": "coll2"}]
          console.log("collections", collections);
       
      console.log("collection list". collections);
      if (collections === undefined){
        res.send({error:"No Collections present in DB"});
      }else{
        db.collection("entity").find(
          { 
            course:req.query.course, 
            //date:req.query.date
          }
        ).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          //db.close();
          res.send({result:result});
        });
      }

    });
   });
   
});



module.exports = router;
