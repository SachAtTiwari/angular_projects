const assert = require('assert');
var mongo = require('mongodb');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const crypto = require('crypto');


exports.counLogin = function(req, res, next) {
    try{
    let db = req.app.locals.db;
   // console.log('in cou login', req.body.body);
    db.collection("clogin").find(
     {_username:req.body.body.username})
    .toArray(function(err, dvData) {
        if (err) {
         console.log("err is ", err);
         res.send({result:"notok"});
        }else{
          /*if login verified returned counsellor devotees */
          if(dvData.length > 0 && 
            bcrypt.compareSync(req.body.body.password, dvData[0]._password)){
             // console.log('passed matched');
              // console.log('cdata is', cdata);
              let token = jwt.sign({user:dvData}, crypto.randomBytes(256),
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

exports.getCounsellorData = function(req, res, next) {
  console.log('req is ', findCounsellor(req.query.username));
  db.collection("devotees").find(
    {counsellor: findCounsellor(req.query.username)})
  .toArray(function(err, cdata){
    res.status(200).json({
      result:"ok",
      resources: cdata,
     })
  });
  }


  // Return counsellor name 
function findCounsellor(username) {
      console.log('username found', username);
      cslr = '';
      switch(username) {
        case 'sgp':
          cslr = 'HG Shyam Gopal Prabhuji';
          break;
        case 'kvp':
          cslr = 'HG Kalpvraksha Prabhuji';
          break;
        case 'vcp':
          cslr = 'HG Vaidant Chaitnya Prabhuji';
          break;
        case 'pvnp':
          cslr = 'HG Pundrik Vidhyanidhi Prabhuji';
          break;
        case 'jnp':
          cslr = 'HG Jagadanand Pandit Prabhuji';
          break;
      }
      return cslr;
  }