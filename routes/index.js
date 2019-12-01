var express = require('express');
var router = express.Router();

router.get('/vacation', function(req, res) {
    var db = req.db;

    var collection = db.get('packages');
    collection.find({},{},function(e,docs){
		// Send that array of stuff to the EJS page 'userlist' to make a web page with em all
        res.render('vacayPackages.ejs', 
		{ 
			title : "Vacation Packages",
            pkgList : docs
        });
    });
});

router.get('/registration', function(req, res, next) {
  res.render('registration.ejs', { title: 'Client Registration' });
});

router.get('/thanks', function(req, res, next) {
  res.render('thanks.ejs', { title: 'Thanks for your data' });
});

router.get('/index', function(req, res, next) {
  res.render('index.ejs', { title: 'Travel Experts' });
});

router.get('/contactus', function(req, res, next) {
  res.render('contactus.ejs', { title: 'Contact Us' });
});

router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Travel Experts' });
});



module.exports = router;