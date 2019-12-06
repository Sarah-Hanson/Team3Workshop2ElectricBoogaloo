// Main contributors Sarah, Hamish and Wade

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

//var loginName = "";
// var loggedIn = false;

	
//login submission - Hamish, password encryption check - Wade
router.post("/login_form", (req, res) => {
	const bcrypt = require('bcrypt'); // password encryption module
	var userEmail = req.body.CustEmail.toLowerCase();
	var userPass = req.body.CustPassword;
	var pwdHashed = false;

	//connecting to database
	mongo.connect(url, { useUnifiedTopology: true}, (err, client) => {
		if (err) { throw err;
		} else {
			//console.log(userEmail);
			//console.log("Connected to Database");
			//find posted email
			var dbo = client.db("travelexperts");
			dbo.collection("customers").findOne({ CustEmail: userEmail }, (err, result) => {
				if (err) {
					throw err;
				} else {
					//No email
					//console.log(result);
					//console.log()
					if (result == null) {
						res.redirect("/noemail"); //check naming
					}
					else {
						//password checked and correct
						bcrypt.compare(userPass, result.CustPassword, function (err, pwdResult) { // compare hashed password from db to password provided
							if (pwdResult) {
								//console.log("Customer Name pass is correct");
								req.session.loginName = result.CustFirstName;
								req.session.loggedIn = true;
								req.session._id = result._id
								// console.log(req.session.id);
								//console.log("Login Name is: " + loginName);
								//console.log("Logged in: " + loggedIn);
								res.redirect("/index");
							}
							else {  //if passwords do not match
								res.redirect("/incorrectpass");
							};
						});
					}
				}
			});
		}
	});
});

//Logout button - Hamish
router.post("/logout_form", (req, res) => {

	//req.sessionloginName = "";
	req.session.destroy();
	res.redirect("/index");

});

// Sarah Hanson
router.get('/vacation', function (req, res) {
	var db = req.db;

	var collection = db.get('packages');
	collection.find({}, {}, function (e, docs) {
		// Send that array of stuff to the EJS page 'userlist' to make a web page with em all
		res.render('vacayPackages.ejs',
			{
				title: "Vacation Packages",
				pkgList: docs,
				name: req.session.loginName,
				loggedstat: req.session.loggedIn
			});
	});
});

// Sarah Hanson
router.get('/pickapackage', function (req, res, next) {
	if (req.session.loggedIn) {
		var db = req.db;
		var collection = db.get('packages');
		collection.find({}, {}, function (e, docs) {
			res.render('pickapackage.ejs', {
				title: 'Choose your Destination!',
				pkgList: docs,
				pkgArr: JSON.stringify(docs),
				pkgID: req.query.pkgID,
				name: req.session.loginName,
				loggedstat: req.session.loggedIn,
				custID: req.session._id
			});
		});
	}
	else {
		res.redirect("/pickError");
	}
});

// Wade Grimm
router.get('/registration', function (req, res, next) {
	res.render('registration.ejs', {
		title: 'Client Registration',
		name: req.session.loginName,
		loggedstat: req.session.loggedIn
	});
});

// Wade Grimm
router.get('/thanksReg', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Thanks for your data', popText: 'Thank you for registering', dest: 'index' });
});

// Sarah Hanson
router.get('/thanksBook', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Thanks for booking', popText: 'Thanks you for booking with Travel Experts', dest: 'index' });
});

// Wade Grimm
router.get('/regerror', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Data Exists', popText: 'Registration Error - User or email exists, please check data and resubmit', dest: 'registration' });
});

// Sarah? Hamish?
router.get('/pickError', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Not logged in', popText: 'Please log in before booking a package', dest: 'registration' });
});

// Hamish
router.get('/incorrectpass', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Incorrect Password', popText: 'USerId or Password incorrect', dest: 'index' });
});

// Hamish
router.get('/noemail', function (req, res, next) {
	res.render('thanks.ejs', { title: 'Invalid Email', popText: 'Not a valid email, please register first', dest: "registration" });
});

// Hamish
router.get('/index', function (req, res, next) {
	res.render('index.ejs', {
		title: 'Travel Experts',
		name: req.session.loginName,
		loggedstat: req.session.loggedIn
	});
});


/*
//Updates the base travelExperts DB with a couple extra fields and documents - Sarah
router.get('/updateDB', function (req, res, next) {
	var db = req.db;
	var collection = db.get('packages');

	var updateArr = ["Shirahama2.jpg", "hawaii.jpg", "Kyoto2.jpg", "TrafalgarSq2.jpg"];
	var i;
	for (i = 0; i < updateArr.length; i++) {
		collection.update({
			_id: i + 1
		}, {
			$set: {
				"imgsrc": "pkgs/" + updateArr[i]
			}
		}, {
			upsert: true,
			multi: true
		})
	}

	var newItems = [{
		"PackageId": 5,
		"PkgName": "West Coast Trail Trip",
		"PkgStartDate": "2020-11-01T00:00:00.000Z",
		"PkgEndDate": "2020-11-14T00:00:00.000Z",
		"PkgDesc": "A gruelling, yet beautiful trip along the coast",
		"PkgBasePrice": 3000,
		"PkgAgencyCommission": 450,
		"imgsrc": "pkgs/Cliffs-crop.jpg"
	}, {
		"PackageId": 6,
		"PkgName": "Victoria Island vacation",
		"PkgStartDate": "2020-11-01T00:00:00.000Z",
		"PkgEndDate": "2020-11-14T00:00:00.000Z",
		"PkgDesc": "Relax, and experience island time on the beautiful Victoria Island",
		"PkgBasePrice": 3000,
		"PkgAgencyCommission": 450,
		"imgsrc": "pkgs/Harbor-crop.jpg"
	}, {
		"PackageId": 7,
		"PkgName": "Backcountry Lodge Expedition",
		"PkgStartDate": "2020-11-01T00:00:00.000Z",
		"PkgEndDate": "2020-11-14T00:00:00.000Z",
		"PkgDesc": "Fly in to a stunning backcountry lodge, with plenty of hiking, and all the luxury of an all inclusive",
		"PkgBasePrice": 3000,
		"PkgAgencyCommission": 450,
		"imgsrc": "pkgs/Mountain-crop.jpg"
	}, {
		"PackageId": 8,
		"PkgName": "North Saskatechewan Fish 'n Fry",
		"PkgStartDate": "2020-11-01T00:00:00.000Z",
		"PkgEndDate": "2020-11-14T00:00:00.000Z",
		"PkgDesc": "Fly in to a remote lake in northern saskatchewan, all the beer and fish you can handle",
		"PkgBasePrice": 3000,
		"PkgAgencyCommission": 450,
		"imgsrc": "pkgs/Sunrise-crop.jpg"
	}];
	collection.insert(newItems);

	//For Testing Reasons, take to a page and puke out the collection
	collection.find({}, {}, function (e, docs) {
		res.render('updateDB.ejs', {
			pkgList: docs,
			title: 'DB Fix Travel Experts'
		});
	});
});


//Created by Sarah, modified by Wade -> Thanks for the typo fixes <3
router.get('/updateDB2', function (req, res, next) {
	// var db = req.db;
	// var collection = db.get('customers');
	// collection.updateMany( {}, {$set: {"CustPassword": "password"}}, false, true);
	mongo.connect(url, { useUnifiedTopology: true }, (err, db) => {
		if (err) throw err;
		//console.log("connected");
		var dbo = db.db("travelexperts");
	
		//console.log("CustFirstName: " + formData[0] + ", CustLastName: " + formData[1]);
		dbo.collection("customers").updateMany( {}, {$set: {"CustPassword": "$2b$10$1GCEG4PVtV87Xciv7ISVVu.3JhHMT7/1Jac1bJkUgUtcQOi48RHIi"}}, false, true);
		db.close();
	
	});
	
	res.render('thanks.ejs', { title: 'secureScript', popText: 'secure passwords set in db', dest: "index"});
	
});

*/

// Imported formatted and code additons by Wade Grimm, Integrating Raymonds changes from a seperate Git repository into the main work Sarah, Hamish
// and Wade have been using all along

router.get('/contactus', function (req, res, next) {
	const http = require("http");
	var MongoClient = require('mongodb').MongoClient;
	var url = "mongodb://localhost:27017/";
	MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => {
		//http.createServer(function (req, res) { MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
		if (err) throw err;
		var dbo = db.db("travelexperts");
		var query = { AgencyId: 1 };
		var query2 = { AgencyId: 2 };


		dbo.collection("agencies").find(query, {
			projection: {
				_id: 0,
				AgncyAddress: 1,
				AgncyCity: 1,
				AgncyProv: 1,
				AgncyPostal: 1,
				AgncyCountry: 1,
				AgncyPhone: 1,
				AgncyFax: 1
			}
		}).toArray(function (err, data) {
			dbo.collection("agents").find(query, {
				projection: {
					_id: 0,
					AgtFirstName: 1,
					AgtLastName: 1,
					AgtEmail: 1,
					AgtBusPhone: 1
				}
			}).toArray(function (err, result) {
				if (err) throw err;
				var x = result;
				var y = data;
				//console.log(y);
				//console.log(x);

				dbo.collection("agencies").find(query2, {
					projection: {
						_id: 0,
						AgncyAddress: 1,
						AgncyCity: 1,
						AgncyProv: 1,
						AgncyPostal: 1,
						AgncyCountry: 1,
						AgncyPhone: 1,
						AgncyFax: 1
					}
				}).toArray(function (err, data) {
					dbo.collection("agents").find(query2, {
						projection: {
							_id: 0,
							AgtFirstName: 1,
							AgtLastName: 1,
							AgtEmail: 1,
							AgtBusPhone: 1
						}
					}).toArray(function (err, result) {
						if (err) throw err;
						var w = result;
						var z = data;
						//console.log(w);
						//console.log(z);




						res.writeHead(200, {
							"Content-Type": "text/html"
						});
						res.write('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1,' +
							'shrink-to-fit=no"><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"' +
							'integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">' +
							'<link href="https://fonts.googleapis.com/css?family=Ibarra+Real+Nova:400i&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Baskervville&display=swap" rel="stylesheet">' +
							'<link rel="stylesheet" type="text/css" href="contactus.css"><title>Contact Us page</title></head><body>');
// Navbar added by Wade Grimm to allow traversing the entire site in a fluid manner.
						res.write('<nav class="navbar navbar-dark fixed-top bg-dark">' +
						'<a class="navbar-brand" href="/index">Travel Experts</a>' +
						'<button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse"' +
							'aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">' +
							'<span class="navbar-toggler-icon"></span> </button>'+
						'<div class="collapse navbar-collapse" id="navbarCollapse">'+
							'<ul class="navbar-nav mr-auto">'+
								'<li class="nav-item active">'+
									'<form class="form-inline mt-2 mt-md-0" action="/login_form" method="post">'+
										'<input class="form-control mr-sm-2" type="text" placeholder="Email" aria-label="Email" name="CustEmail">'+
										'<input class="form-control mr-sm-2" type="password" placeholder="Password" aria-label="Password" name="CustPassword">'+
										'<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Login</button></form>'+
								'</li><br />'+
								'<li class="nav-item"> <a class="nav-link" href="/index">Travel Experts Home</a>'+
								'<li class="nav-item"> <a class="nav-link" href="/ContactUs">Contact Us</a>'+
								'<li class="nav-item"> <a class="nav-link" href="/vacation">Vacation Packages</a>'+
								'<li class="nav-item"> <a class="nav-link" href="/registration">Client Registration</a>	'+
								'</li>'+
							'</ul>'+
								'<form action="/logout_form" method="post">'+
									'<button class="btn btn-outline-success my-2 my-sm-0" type="submit">Logout</button>'+
								'</form></div></nav>');
						res.write('<div class="jumbotron jumbotron-fluid sticky-top pt-50" style="background-image: url(https://media.architecturaldigest.com/photos/5d77e96ed6d1d60008832ccc/master/pass/GettyImages-513939550.jpg);background-size: 100% 100%;"><div class="container text-center"><h1>Contact Us</h1></div></div>');
						res.write(' <div class="container"><div><h3>We are here to meet your travel needs</h3><p>Our dedication to customer service is the cornerstone of our company.If you have any question or requests,our Specialists are willing and ready to help.<p>Please feel free to speak with any one of them</p></p></div></div><br/><br/>')


						res.write('<div class="container">')
						res.write("<p><strong>AGENCY 1</strong></p>")
						res.write("<p><strong>Office Address:</strong> " + y[0].AgncyAddress + " " + y[0].AgncyCity + " " + y[0].AgncyProv + "  " + y[0].AgncyPostal + " " + y[0].AgncyCountry +
							"<br/><strong>Phone: </strong>" + y[0].AgncyPhone + "<br/><strong>Fax: </strong>" + y[0].AgncyFax + "</p>");
						res.write('</div>')

						res.write('<div class="container"><div class="row">')
						res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">' +
							'<img class="card-img-top" src="/agentt4.jpg" width:100%" /><div class="card-body"><h4 class="card-title text-center">' + x[0].AgtFirstName + " " + x[0].AgtLastName + '</h4><p class="card-text">' +
							'<strong>Tel:</strong>' + x[0].AgtBusPhone + '<br/>' + x[0].AgtEmail + '<br/><strong>Experience:</strong>2+ years <br/><strong>Language(s)</strong>: English,Punjabi</p></div></div></div></div>')
						// res.write("<p>Name: " + x[0].AgtFirstName + " "+ x[0].AgtLastName+ "<br/>Email: "+ x[0].AgtEmail +"<br/>Phone: " + x[0].AgtBusPhone +  "</p>");

						res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">' +
							'<img class="card-img-top" src="/agentt5.jpg" style="width:100%"><div class="card-body"><h4 class="card-title text-center">' + x[1].AgtFirstName + " " + x[1].AgtLastName + '</h4><p class="card-text">' +
							'<strong>Tel:</strong> ' + x[1].AgtBusPhone + '<br/>' + x[1].AgtEmail + '<br/><strong>Experience:</strong>2+ years <br/><strong>Language(s)</strong>: English,Mandarin</p></div></div></div></div>')
						// res.write("<p>Name: " + x[1].AgtFirstName + " "+ x[1].AgtLastName+ "<br/>Email: "+ x[0].AgtEmail +"<br/>Phone: " + x[1].AgtBusPhone +  "</p>");

						res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">' +
							'<img class="card-img-top" src="/agentt2.jpg" style="width:100%"><div class="card-body"><h4 class="card-title text-center" >' + x[2].AgtFirstName + " " + x[2].AgtLastName + '</h4><p class="card-text">' +
							'<strong>Tel:</strong> ' + x[2].AgtBusPhone + '<br/>' + x[2].AgtEmail + '<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English,Spanish</p></div></div></div></div>')

						res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">' +
							'<img class="card-img-top" src="/agentt10.jpg" style="width:100%"><div class="card-body"><h4 class="card-title text-center">' + x[3].AgtFirstName + " " + x[3].AgtLastName + '</h4><p class="card-text">' +
							'<strong>Tel:</strong>' + x[3].AgtBusPhone + '<br/>' + x[3].AgtEmail + '<br/><strong>Experience:</strong>5 years <br/><strong>Language(s)</strong>: English, Italian</p></div></div></div></div>')

						res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">' +
							'<img class="card-img-top" src="/agentt8.jpg" style="width:100%"><div class="card-body"><h4 class="card-title text-center">' + x[4].AgtFirstName + " " + x[4].AgtLastName + '</h4><p class="card-text">' +
							'<strong>Tel:</strong>' + x[4].AgtBusPhone + '<br/>' + x[4].AgtEmail + '<br/><strong>Experience:</strong>3 years <br/><strong>Language(s)</strong>: English, French</p></div></div></div></div>')
						res.write('</div></div><br/><br/><br/><br/><br/>')


						res.write('<div class="container">')
						res.write("<p><strong>AGENCY 2</strong></p>")
						res.write("<p><strong>Office Address:</strong> " + z[0].AgncyAddress + " " + z[0].AgncyCity + " " + z[0].AgncyProv + "  " + z[0].AgncyPostal + " " + z[0].AgncyCountry +
							"<br/><strong>Phone: </strong>" + z[0].AgncyPhone + "<br/><strong>Fax: </strong>" + z[0].AgncyFax + "</p>");
						res.write('</div>')

						res.write('<div class="container"><div class="row">')
						res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">' +
							'<img class="card-img-top" src="/agentt6.jpg" style="width:100%" /><div class="card-body"><h4 class="card-title text-center">' + w[0].AgtFirstName + " " + w[0].AgtLastName + '</h4><p class="card-text">' +
							'<strong>Tel:</strong>' + w[0].AgtBusPhone + '<br/>' + w[0].AgtEmail + '<br/><strong>Experience:</strong>2+ years <br/><strong>Language(s)</strong>: English</p></div></div></div></div>')


						res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">' +
							'<img class="card-img-top" src="/agentt11.jpg" style="width:100%" /><div class="card-body"><h4 class="card-title text-center">' + w[1].AgtFirstName + " " + w[1].AgtLastName + '</h4><p class="card-text">' +
							'<strong>Tel:</strong>' + w[1].AgtBusPhone + '<br/>' + w[1].AgtEmail + '<br/><strong>Experience:</strong>7 years <br/><strong>Language(s)</strong>: English,Filipino</p></div></div></div></div>')


						res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">' +
							'<img class="card-img-top" src="/agentt3.jpg"style="width:100%" /><div class="card-body"><h4 class="card-title text-center">' + w[2].AgtFirstName + " " + w[2].AgtLastName + '</h4><p class="card-text">' +
							'<strong>Tel:</strong>' + w[2].AgtBusPhone + '<br/>' + w[2].AgtEmail + '<br/><strong>Experience:</strong>3+ years <br/><strong>Language(s)</strong>: English,Portuguese</p></div></div></div></div>')


						res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">' +
						'<img class="card-img-top" src="/agentt.jpg"style="width:100%" /><div class="card-body"><h4 class="card-title text-center">' + w[3].AgtFirstName + " " + w[3].AgtLastName + '</h4><p class="card-text">' +
							'<strong>Tel:</strong>' + w[3].AgtBusPhone + '<br/>' + w[3].AgtEmail + '<br/><strong>Experience:</strong>4 years <br/><strong>Language(s)</strong>: English,Japanese</p></div></div></div></div>')




						res.write('</div></div><br/><br/><br/><br/><br/>')

						res.write(' <footer><div class="jumbotron jumbotron-fluid"><p id="terms">COPYRIGHT &copy; 2019 Codecruisers Technologies Inc. All rights reserved<a href="">TERMS OF SALE &nbsp;|</a><a href="">TERMS OF USE &nbsp;|</a><a href="">RETURN POLICY &nbsp;|</a><a href="">PRIVACY POLICY &nbsp;|</a></p></div></div></footer>')






						res.write(' <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>');
						res.write(' <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>');
						res.write('<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>');
						res.write("</body></html>");
						res.end();


						db.close();


					});
				});
			});
		});
	});

});

// Sarah
router.get('/', function (req, res, next) {
	res.render('index.ejs', {
		title: 'Travel Experts',
		name: req.session.loginName,
		loggedstat: req.session.loggedIn
	});
});


module.exports = router;