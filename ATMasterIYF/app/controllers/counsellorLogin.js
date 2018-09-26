const assert = require('assert');
var mongo = require('mongodb');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const crypto = require('crypto');

secret = crypto.randomBytes(256);
exports.secret = secret;


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
              let token = jwt.sign({user:dvData}, secret,
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

function getDate() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const datenew =  date.getDate() + '-' + month + '-' + date.getFullYear();
  return datenew;
}

exports.updateComment = function(req, res, next) {
    console.log('comment is ', req.body);
      try{
        let db = req.app.locals.db;
        let date = new Date();
        let month = date.getMonth() + 1
        date =  date.getDate() + '-' + month + '-' + date.getFullYear();

        db.listCollections().toArray(function(err, collections){     
              if (collections === undefined){
                res.send({error:"No Collections present in DB"});
              }else{
                //Check if calling status already marked for the contact
                db.collection("devotees").find(
                  { 
                    contact:req.body.body.contact, 
                    "calling.date": date,  
                  }
                ).toArray(function(err, result) {
                  if (err) {
                    console.log("err is 1", err);
                    res.send({error:500});
                  } else {
                  if(result.length === 0){
                    db.collection("devotees").update(
                      {contact:req.body.body.contact}, 
                      {$set: {selected:req.body.body.selected, lockedDate: getDate()}, 
                      $push:{calling:{date: date, comment:req.body.body.selected}}},
                      {upsert:false}, 
                      function(err, resatt) {
                        if (err) {
                          console.log("err is ", err);
                          res.send({result:"notok"});
                         } else {
                            res.send({result:"ok"});
                         }
                     });
                  }else{
                    res.send({result:"notok"});
                  }
                 }  
                });
              }
            });
          }catch(err){
            console.log("Exception :", err);
        }
}

exports.iscTokenVerified = function(req, res, next) {
  try{
      console.log("verify token ", req.query.token);
      let db = req.app.locals.db;
      //var decoded = jwt.verify(req.query.token, 'khsandasinasfnasiu2194u19u41142i210');
      jwt.verify(req.query.token, secret,
      function(err, decoded){
        if(err){
          // respond to request with error
          console.error("err in verification", err);
          res.send({result:"notok"})
          
        }else{
          // continue with the request
          console.log("decoded ", decoded);
          if(decoded.user.length > 0){
              res.send({result:"ok"})
          }else{
            res.send({result:"notok"})
          }
        }
      });
  }catch(err){
    console.log("Exception :", err);
  }
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