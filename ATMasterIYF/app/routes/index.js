var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/test', function(req, res, next) {
  res.send({ title: 'Express' });
});


/* add Devotee */
router.post('/addDevotee', function(req, res, next) {
  console.log("im here", req.body);
  var client = new elasticsearch.Client({
    host: 'localhost:9200',
    log: 'trace'
  });
  client.create({
    index: req.body.index,
    type: req.body.type,
    body: req.body.body
  }, function (error, response) {
    console.log("response is", response);
  });
  res.send({status:"ok"});
});

module.exports = router;
