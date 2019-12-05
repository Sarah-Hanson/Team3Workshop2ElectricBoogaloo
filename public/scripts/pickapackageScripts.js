/*
	Author: Sarah Hanson
	Pickapackage Scripts
	- Loads The package from the url and pre-selects it in the drop-down box
	- Loads the start+end dates into the fields
	- Possibly handles the form data posting to fill in all the blanks from the form
	- Possibly checks logged in status

/* populates the page using the object created by getDetails */

var pkgList;

function setData(el) {
	pkgList = el;
}

function getMatch(el) {
	for (var i=0;pkgList.length;i++) {
		if (pkgList[i].PkgName == el) return pkgList[i];
	}
	return null;
}

function changePackage (el) {
	var curPkg = getMatch(el);
	if (!curPkg==null) {
		document.getElementById("pkgStart").innerHTML 	= curPkg.PkgStartDate;
		document.getElementById("pkgEnd").innerHTML 	= curPkg.PkgEndDate;
	}
	//console.log(el);
}



module.exports={steupPage};