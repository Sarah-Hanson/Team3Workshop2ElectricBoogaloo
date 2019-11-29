var express = require('express');
var router = express.Router();

/* Opening a new page with EJS template */
router.get('/viewURL', function(req, res) {
    res.render('viewname', { variable: 'What the variable appears as' });
});

/* Submitting things to DB (With Post) */
router.post('/adduser', function(req, res) {
    var db = req.db;

    // Get form values.
    var userName = req.body.username;
    var userEmail = req.body.useremail;
	
	// Get the Mongo *Table*
    var collection = db.get('usercollection');

    // Put the thing into the *table* in the form "column" : value
    collection.insert({
        "username" : userName,
        "email" : userEmail
    },
		/* Error handling function */
		function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
        }
        else {
			/* If it didn't screw up redirect to a new page */
            res.redirect("newPage");
        }
    });
});

/* Getting things from the DB */
router.get('/userlist', function(req, res) {
    var db = req.db;
	
	// Gets the *Table* where the 'collectionName' */
    var collection = db.get('usercollection');
	
	/* 	Finds items in the collection based on criteria
		The one below is essentially a SELECT *
		see https://mongodb.github.io/node-mongodb-native/markdown-docs/queries.html for further documentation
	*/
    collection.find({},{},function(e,docs){
		// Send that array of stuff to the EJS page 'userlist' to make a web page with em all
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

module.exports = router;
