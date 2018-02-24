var express = require('express');
var userController = require('../controllers/userController');
var classController = require('../controllers/classController');
var downloadController = require('../controllers/downloadController');
var router = express.Router();

const dbClient = require('mongodb').MongoClient;
const assert = require('assert');
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'users';


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* Delete a record*/
router.delete('/delRecord', userController.delRecord);

/* add Devotee */
router.post('/addDevotee', userController.addDevotee);

/* Get OTP Devotee */
router.get('/getOTPDevotees', userController.getOTPDevotees);

/* Get Devotee Detail*/
router.get('/getDetails', userController.getDevoteeDetail);

/* mark attendance*/
router.post('/markAttendance', classController.markAttendance);

/* Sdl a Class */
router.post('/sdlClass', classController.sdlClass);

/*Check class Sdl */
router.get('/checkClassSdl', classController.checkClassSdl);

/* Get All Sdl Classes */
router.get('/getSdlClasses', classController.getSdlClasses);

/*Download to Excel */
router.get('/downloadToExcel', downloadController.downloadToExcel);

module.exports = router;
