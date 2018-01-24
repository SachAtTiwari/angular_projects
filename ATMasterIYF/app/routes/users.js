var express = require('express');
var router = express.Router();
var elasticsearch = require('elasticsearch');



/* get devoteee*/
router.put('/getOTPDevotee', function(req, res, next) {
  console.log("get OTP Devotee");
  var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });
  res.send({status:true});
});



module.exports = router;
