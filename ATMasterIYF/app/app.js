var express = require('express');
var session = require('cookie-session')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const helmet = require('helmet')

var index = require('./routes/index');
var users = require('./routes/users');
// allow-cors
const cors = require('cors');
csrf = require('csurf');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

var allowedOrigins = ['http://localhost:4200',
                      'https://devotee-care.herokuapp.com'];

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet())
app.use(cors(
  {
    origin: function(origin, callback){
      // allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(allowedOrigins.indexOf(origin) === -1){
        var msg = 'The CORS policy for this site does not ' +
                  'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  }
));
var csrfValue = function(req) {
  console.log('req body', req.body, req.headers, req.csrfToken());
  var token = (req.body && req.body._csrf)
    || (req.query && req.query._csrf)
    || (req.headers['x-csrf-token'])
    || (req.headers['x-xsrf-token'])
    || (req.csrfToken());
  return token;
};


const cookieOptions = {
  key: 'XSRF-TOKEN',
  secure: false,
  httpOnly: false,
  maxAge: 3600
}

app.use(csrf({ cookie: cookieOptions, value: csrfValue }));

app.use('/', index);
app.use('/classSdl', index);
app.use('/updateDevotee', index);
app.use('/addDevotee', index);
app.use('/markAttendance', index);
app.use('/getOTPDevotees', index);
app.use('/downloadToExcel', index);
app.use('/downloadToExCounsellor', index);
app.use('/checkClassSdl', index);
app.use('/SdlClass', index);
app.use('/getSdlClasses', index);
app.use('/delRecord', index);
app.use('/getDetails', index);
app.use('/getAllDevotees', index);
app.use('/getSearchedDevotee', index);
app.use('/getTodayAttendance', index);
app.use('/addDevoteeGeneric', index);
app.use('/adminLogin', index);
app.use('/isTokenVerified', index);
app.use('/checkDevoteeStatusForGivenDate', index);




//app.get('/test', (req,res) => {
//  return res.end('Api working');
//})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
