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
  console.log("im here", req.body);
  MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    db.listCollections().toArray(function(err, collections){     
      console.log("collection list". collections);
      if (collections === undefined){
        res.send({error:"No Collections present in DB"});
      }else{
        db.collection("devotees").update({name:'Sachin Tiwari'}, {$push:{attendance:req.body.attendance}},
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
 res.send({status:"ok"});
  

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
      req.body.body.course = "OTP";

      db.collection("devotees").insertOne(req.body.body, function(err, res) {
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



router.get('/downloadToExcel', function(req, res, next) {
  console.log("im here", req.query.date);
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
        db.collection("devotees").find(
          { 
            course:req.query.course, 
            counsellor:req.query.counsellor,
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
