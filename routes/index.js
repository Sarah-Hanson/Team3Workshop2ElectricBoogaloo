var express = require('express');
const session = require('express-session');
var router = express.Router();
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/travelexperts";

var mySession = {
	secret: "yoshi",
	cookie: {}
}

router.use(session(mySession));

var loginName = "";
var loggedIn = "false";

//login submission
router.post("/login_form", (req, res) => {

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
			//res.send("Welcome back " + loginName);
			
			res.redirect("/index");
          }
          //if passwords do not match
          else {
            loginName = "Incorrect Password";
			//res.send("Incorrect Password");
          }
        }
      });
    }
  });
});

router.get('/vacation', function(req, res) {
    var db = req.db;

    var collection = db.get('packages');
    collection.find({},{},function(e,docs){
		// Send that array of stuff to the EJS page 'userlist' to make a web page with em all
        res.render('vacayPackages.ejs', 
		{ 
			title : "Vacation Packages",
            pkgList : docs,
			name: loginName,
			loggedstat: loggedIn
        });
    });
});

router.get('/pickapackage', function(req, res, next) {
	var db = req.db;
    var collection = db.get('packages');
    collection.find({},{},function(e,docs){
		res.render('pickapackage.ejs',
		{
			title: 'Choose your Destination!',
			pkgList : docs,
			pkgArr : JSON.stringify(docs),
			pkgID : req.query.pkgID,
			name: loginName,
			loggedstat: loggedIn
		});
	});
});

router.get('/registration', function(req, res, next) {
  res.render('registration.ejs', { 
  title: 'Client Registration',
  name: loginName,
  loggedstat: loggedIn 
  });
});

router.get('/thanks', function(req, res, next) {
  res.render('thanks.ejs', { title: 'Thanks for your data' });
});

router.get('/index', function(req, res, next) {
  res.render('index.ejs', { 
  title: 'Travel Experts',
  name: loginName,
  loggedstat: loggedIn
  });
});

router.get('/contactus', function(req, res, next) {
  res.render('contactus.ejs', { 
  title: 'Contact Us',
  name: loginName,
  loggedstat: loggedIn
 });
});

router.get('/', function(req, res, next) {
  res.render('index.ejs', { 
  title: 'Travel Experts',
  name: loginName,
  loggedstat: loggedIn
 });
});

module.exports = router;