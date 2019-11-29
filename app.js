var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var monk = require('monk');
var db = monk('localhost:27017/travelexperts');
var formData = [];

console.log("passed init");

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// added 3 statics by WG, solved issues with images, styles and functions not loading
app.use(express.static(path.join(__dirname, 'public/stylesheets')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/scripts')));

console.log("passed init");

app.use(function (req, res, next) {
  req.db = db;
  db.get("agents");
  next();
});
app.use('/', indexRouter);
//app.use('/users', usersRouter);

console.log("passed Router");




app.post("/post_form", (req, res) => {
  //console.log("In post form");
  //console.log(req.body.firstname);
  formData[0] = req.body.firstname;
  formData[1] = req.body.lastname;
  formData[2] = req.body.address;
  formData[3] = req.body.address2;
  formData[4] = req.body.city;
  formData[5] = req.body.prov;
  formData[6] = req.body.postal;
  formData[7] = req.body.homephone;
  formData[8] = req.body.busphone;
  formData[9] = req.body.email;
  formData[10] = req.body.password;
  //res.end("Data received: fname=" + fname + ", lname=" + lname);
  //res.redirect("/thanks");
  var collection = db.get('customers');
  collection.insert({
      "CustFirstName": formData[0],
      "CustLastName": formData[1],
      "CustAddress": formData[2],
      "CustAddress2": formData[3],
      "CustCity": formData[4],
      "CustProv": formData[5],
      "CustPostal": formData[6],
      "CustHomePhone": formData[7],
      "CustBusPhone": formData[8],
      "CustEmail": formData[9],
      "CustPassword": formData[10]
    },
    /* Error handling function */
    function (err, doc) {
      if (err) {
        res.send("There was a problem adding the information to the database.");
      } else {
        /* If it didn't screw up redirect to a new page */
        res.redirect("/thanks");
      }
    });

  //res.redirect("/thanks");
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render('error');
});


module.exports = app;