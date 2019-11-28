var express = require('express');
var router = express.Router();

/* GET vacay page. */
router.get('/vacation', function(req, res, next) {
  res.render('vacayPackages.ejs', { title: 'Vacation Packages' });
});

router.get('/', function(req, res, next) {
  res.render('index.ejs', { title: 'hello' });
});

module.exports = router;


