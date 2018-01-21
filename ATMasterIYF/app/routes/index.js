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

router.get('/test', function(req, res, next) {
  res.send({ title: 'Express' });
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
      db.close();
    });
   });
   res.send({status:"ok"});
   
});

module.exports = router;
