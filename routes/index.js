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

router.get('/pickapackage', function(req, res, next) {
	var db = req.db;
    var collection = db.get('packages');
    collection.find({},{},function(e,docs){
		res.render('pickapackage.ejs',
		{
			title: 'Choose your Destination!',
			pkgList : docs,
			pkgArr : JSON.stringify(docs),
			pkgID : req.query.pkgID
		});
	});
	console.log()
});

router.get('/registration', function(req, res, next) {
  res.render('registration.ejs', { title: 'Client Registration' });
});

router.get('/thanks', function(req, res, next) {
  res.render('thanks.ejs', { title: 'Thanks for your data' });
});

router.get('/regerror', function(req, res, next) {
  res.render('regerror.ejs', { title: 'Data Exists' });
});

router.get('/index', function(req, res, next) {
  res.render('index.ejs', { title: 'Travel Experts' });
});

router.get('/contactus', function(req, res, next) {
  res.render('contactus.ejs', { title: 'Contact Us' });
});

//Updates the base travelExperts DB with a couple extra fields and documents
router.get('/updateDB', function(req, res, next) {
	var db = req.db;
	var collection = db.get('packages');

	var updateArr = ["Shirahama2.jpg","hawaii.jpg","Kyoto2.jpg","TrafalgarSq2.jpg""];
	var i;
	for (i=0;i<updateArr.length;i++) {
		collection.update(
		{id_:i},
		{$set : {"imgsrc":[i]}},
		{upsert:false,multi:true}) 
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
		}, {,
		"PackageId": 6,
		"PkgName": "Victoria Island vacation",
		"PkgStartDate": "2020-11-01T00:00:00.000Z",
		"PkgEndDate": "2020-11-14T00:00:00.000Z",
		"PkgDesc": "Relax, and experience island time on the beautiful Victoria Island",
		"PkgBasePrice": 3000,
		"PkgAgencyCommission": 450,
		"imgsrc": "pkgs/Harbor-crop.jpg"
		}, {,
		"PackageId": 7,
		"PkgName": "Backcountry Lodge Expedition",
		"PkgStartDate": "2020-11-01T00:00:00.000Z",
		"PkgEndDate": "2020-11-14T00:00:00.000Z",
		"PkgDesc": "Fly in to a stunning backcountry lodge, with plenty of hiking, and all the luxury of an all inclusive",
		"PkgBasePrice": 3000,
		"PkgAgencyCommission": 450,
		"imgsrc": "pkgs/Mountain-crop.jpg"
		}, {,
		"PackageId": 8,
		"PkgName": "North Saskatechewan Fish 'n Fry",
		"PkgStartDate": "2020-11-01T00:00:00.000Z",
		"PkgEndDate": "2020-11-14T00:00:00.000Z",
		"PkgDesc": "Fly in to a remote lake in northern saskatchewan, all the beer and fish you can handle",
		"PkgBasePrice": 3000,
		"PkgAgencyCommission": 450,
		"imgsrc": "pkgs/Sunrise-crop.jpg"
	}]
	collection.instert(newItems);
	
	//For Testing Reasons, take to a page and puke out the collection
	collection.find({},{},function(e,docs){
	res.render('updateDB.ejs'), { pkgList : docs });
});


router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'Travel Experts' });
});



module.exports = router;