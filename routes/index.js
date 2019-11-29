var express = require('express');
var router = express.Router();

/* GET vacay page. */
router.get('/vacation', function(req, res, next) {
  res.render('vacayPackages.ejs', { title: 'Vacation Packages' });
});

//Wade's registration page
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

router.get('/vacaypackages', function(req, res, next) {
  res.render('vacaypackages.ejs', { title: 'Vacation Packages' });
});

router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Travel Experts' });
});

module.exports = router;


