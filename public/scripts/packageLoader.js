/*
	Author: Sarah Hanson
	Package loader Script
	Purpose: determine the package selected by the user and dyanimically
	update the packages html page on load to have the info, details and 
	image for that specific package. Packages are store in external JSON
	files that can be used to populate the page.
*/

/* populates the page using the object created by getDetails */
function setupPage (packageConfig) {
	var pageDetails =JSON.parse(packageConfig);
	console.log("setup");
	document.getElementById("featureTitle").innerHTML 	= pageDetails.title;
	document.getElementById("featureBlurb").innerHTML 	= pageDetails.blurb;
	document.getElementById("featureDetails").innerHTML = pageDetails.details;
	document.getElementById("featureIMG").src = pageDetails.imgURL;
	document.title = pageDetails.title;
}

module.exports={steupPage};