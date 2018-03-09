const dbClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
//const url = 'mongodb://localhost:27017';
const url = 'mongodb://iyfuser:h2so4na2co#@ds253918.mlab.com:53918/iyfdb';

 
// Database Name
const dbName = 'iyfdb';


exports.downloadToExcel =  function(req, res, next) {
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
                "attendance.date":req.query.date,  
              }
              ).toArray(function(err, result) {
                if (err) throw err;
                console.log("result is ",result);
                res.send({result:result});
              });
          }
        });
     });
}