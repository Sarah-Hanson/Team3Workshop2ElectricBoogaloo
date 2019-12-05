var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var monk = require('monk');
const session = require('express-session');
var db = monk('localhost:27017/travelexperts');
var formData = [];
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/travelexperts";


console.log("./>------------------<\\\n<<>> Server Running <<>>\n.\\>------------------</");

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
// Sarah is tentatively taking this out cause I don't think its needed with the other 3 includes
// app.use(express.static(path.join(__dirname, 'public')));
// added 3 statics by WG, solved issues with images, styles and functions not loading

app.use(express.static(path.join(__dirname, 'public/stylesheets')));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, 'public/scripts')));
app.use(express.static(path.join(__dirname, 'public/pkgFiles')));

console.log("public folders loaded");

app.use(function (req, res, next) {
  req.db = db;
  db.get("agents");
  next();
});
app.use('/', indexRouter);
//app.use('/users', usersRouter);

console.log("router loaded");

//Registration submission, added by Wade Grimm 
// Lots of Console.logs to follow as a ton of troubleshooting was required.
app.post("/post_form", (req, res) => {
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  const myPlaintextPassword = req.body.password;
 

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
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
      //console.log("Plain pwd: " + myPlaintextPassword);
      //console.log("Hashed pwd: " + hash);
      formData[10] = hash;
    });
  });

  mongo.connect(url, { useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;
    //console.log("connected");
    var dbo = db.db("travelexperts");

    //console.log("CustFirstName: " + formData[0] + ", CustLastName: " + formData[1]);
    dbo.collection("customers").findOne({ CustFirstName: formData[0], CustLastName: formData[1] }, (err, result) => {
      //console.log("foundName: " + foundName.CustomerId);
      if (result != null) {
        //console.log("User Exists");
        db.close();
        //res.send("/UserExists");
        res.redirect("/regerror");
      } else {

        dbo.collection("customers").find().sort({ CustomerId: -1 }).toArray((err, result) => {
          if (err) throw err;
          //console.log(result[0].CustomerId);
          clientID = result[0].CustomerId + 1;
          //console.log("ClientID: " + clientID);
       
          var mydoc = {
            CustFirstName: formData[0],
            CustLastName: formData[1],
            CustAddress: formData[2],
            CustAddress2: formData[3],
            CustCity: formData[4],
            CustProv: formData[5],
            CustPostal: formData[6],
            CustHomePhone: formData[7],
            CustBusPhone: formData[8],
            CustEmail: formData[9],
            CustPassword: formData[10],
            CustomerId: clientID,
            _id: clientID
          };
          dbo.collection("customers").insertOne(mydoc, (err, result) => {
            if (err) throw err;
            // console.log("Customer inserted");
            // console.log(result.result);
            db.close();
            res.redirect("/thanksReg");
          });
        });
      };
    });
  });
});

//booking post added by Sarah
app.post("/post_booking", function (req, res) {
  var db = req.db;
  var pkgNum = req.body.packageNum;
  var travellers = req.body.travellers;
  var collection = db.get('bookings');

  var bookingID;
  var bookingArr;
  collection.find({}, {}, function (e, docs) {
    docs = sort_by_key(docs, "BookingId");
    bookingArr = docs;
    bookingID = docs[0].BookingId + 1;
    collection.insert({
      "BookingId": bookingID,
      "BookingDate": new Date(),
      "BookingNo": "DFS3",
      "TravelerCount": travellers,
      "CustomerId": 143, //When login works, get it
      "PackageId": pkgNum
    },
      function (err, doc) {
        if (err) {
          res.send("problem adding to db");
        }
        else {
          res.redirect("/thanksBook");
        }
      });
  });
});
// Sarah Hanson
function sort_by_key(array, key) {
  return array.sort(function (a, b) {
    var x = a[key]; var y = b[key];
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}

//login submission
app.post("/login_form", (req, res) => {

  var loggedIn = false;
  var loginName = "";

  var userEmail = req.body.CustEmail;
  var userName = req.body.CustFirstName;

  //connecting to database
  mongo.connect(url, {
    useUnifiedTopology: true
  }, (err, client) => {
    if (err) {
      throw err;
    } else {
      console.log(userEmail);
      console.log("Connected to Database");

      //find posted email
      var dbo = client.db("travelexperts");
      dbo.collection("customers").findOne({
        CustEmail: userEmail
      }, (err, result) => {
        if (err) {
          throw err;
        } else {
          //No email
          if (result == null) {
            //alert("This email is not in our records, please register on our site", "Register");
            res.redirect("/registration"); //check naming
          }
          //password checked and correct
          else if (userName === result.CustFirstName) {
            console.log("Customer Name pass is correct");
            loginName = result.CustFirstName;
            loggedIn = true;
            console.log("Login Name is: " + loginName);
            console.log("Logged in: " + loggedIn);
            res.send("Welcome back " + loginName);
          }
          //if passwords do not match
          else {
            res.send("Incorrect Password");
          }
        }
      });
    }
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log(req.url);
  //console.log(res.url);
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