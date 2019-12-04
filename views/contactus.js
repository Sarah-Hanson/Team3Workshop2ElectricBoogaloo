// const express=require("express");
// const app= express();
const http = require("http");
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

http.createServer(function(req, res){
 MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function(err, db) {
  if (err) throw err;
  var dbo = db.db("travelexperts");
  var query = {AgencyId :1};
  var query2 = {AgencyId:2};

  
dbo.collection("agencies").find(query, {projection : {_id: 0,AgncyAddress: 1,AgncyCity: 1, AgncyProv:1,
AgncyPostal:1, AgncyCountry:1,AgncyPhone:1,AgncyFax:1}}).toArray(function(err, data) {
dbo.collection("agents").find(query, {projection : {_id: 0, AgtFirstName : 1, AgtLastName: 1, AgtEmail: 1, AgtBusPhone:1 }}).toArray(function(err, result) {
    if (err) throw err;
       var x=result;
       var y=data;
     console.log(y);
    console.log(x);

dbo.collection("agencies").find(query2, {projection : {_id: 0,AgncyAddress: 1,AgncyCity: 1, AgncyProv:1,
AgncyPostal:1, AgncyCountry:1,AgncyPhone:1,AgncyFax:1}}).toArray(function(err, data) {
dbo.collection("agents").find(query2, {projection : {_id: 0, AgtFirstName : 1, AgtLastName: 1, AgtEmail: 1, AgtBusPhone:1 }}).toArray(function(err, result) {
    if (err) throw err;
       var w=result;
       var z=data;
     console.log(w);
    console.log(z);




  res.writeHead(200, { "Content-Type":"text/html" });
  res.write('<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1,' 
    + 'shrink-to-fit=no"><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"' 
    + 'integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">'
    +'<link href="https://fonts.googleapis.com/css?family=Ibarra+Real+Nova:400i&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Baskervville&display=swap" rel="stylesheet">'
    +'<link rel="stylesheet" type="text/css" href="contactus.css"><title>Contact Us page</title></head><body>');
  

  res.write('<div class="jumbotron jumbotron-fluid" style="background-image: url(https://media.architecturaldigest.com/photos/5d77e96ed6d1d60008832ccc/master/pass/GettyImages-513939550.jpg);background-size: 100% 100%;"><div class="container text-center"><h1>Contact Us</h1></div></div>');
  res.write(' <div class="container"><div><h3>We are here to meet your travel needs</h3><p>Our dedication to customer service is the cornerstone of our company.If you have any question or requests,our Specialists are willing and ready to help.<p>Please feel free to speak with any one of them</p></p></div></div><br/><br/>')

   
  res.write('<div class="container">')
  res.write("<p><strong>AGENCY 1</strong></p>")
  res.write("<p><strong>Office Address:</strong> " + y[0].AgncyAddress + " "+ y[0].AgncyCity +   " "  + y[0].AgncyProv + "  " + y[0].AgncyPostal + " " + y[0].AgncyCountry+
   "<br/><strong>Phone: </strong>"+ y[0].AgncyPhone +"<br/><strong>Fax: </strong>" + y[0].AgncyFax +  "</p>");
  res.write('</div>')
  
  res.write('<div class="container"><div class="row">')
  res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">'
    +'<img class="card-img-top" src="https://www.lorealparisusa.com/~/media/images/lop/wow-data/honorees/2018/loreal-paris-wow-honorees-bios-main-alisha-zhao.jpg" width:100%" /><div class="card-body"><h4 class="card-title text-center">'+ x[0].AgtFirstName + " "+ x[0].AgtLastName+ '</h4><p class="card-text">'
      +'<strong>Tel:</strong>'+ x[0].AgtBusPhone + '<br/>'+ x[0].AgtEmail+'<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English,Punjab</p></div></div></div></div>')
  // res.write("<p>Name: " + x[0].AgtFirstName + " "+ x[0].AgtLastName+ "<br/>Email: "+ x[0].AgtEmail +"<br/>Phone: " + x[0].AgtBusPhone +  "</p>");
 
  res.write('<div class="row"><div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">'
    +'<img class="card-img-top" src="https://www.lorealparisusa.com/~/media/images/lop/wow-data/honorees/2018/loreal-paris-wow-honorees-bios-main-hannah-dehradunwala.jpg" style="width:100%"><div class="card-body"><h4 class="card-title text-center">'+ x[1].AgtFirstName + " "+ x[1].AgtLastName+ '</h4><p class="card-text">'
      +'<strong>Tel:</strong> '+ x[1].AgtBusPhone + '<br/>'+ x[1].AgtEmail+'<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English,mandarin</p></div></div></div></div></div>')
  // res.write("<p>Name: " + x[1].AgtFirstName + " "+ x[1].AgtLastName+ "<br/>Email: "+ x[0].AgtEmail +"<br/>Phone: " + x[1].AgtBusPhone +  "</p>");
  
   res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">'
    +'<img class="card-img-top" src="https://images.pexels.com/photos/736716/pexels-photo-736716.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" style="width:100%"><div class="card-body"><h4 class="card-title text-center" >'+ x[2].AgtFirstName + " "+ x[2].AgtLastName+ '</h4><p class="card-text">'
      +'<strong>Tel:</strong> '+ x[2].AgtBusPhone + '<br/>'+ x[2].AgtEmail+'<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English</p></div></div></div></div>')
  
  res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">'
    +'<img class="card-img-top" src="https://www.gannett-cdn.com/-mm-/229409e730ac32b7d0ddfbf289defd8b63486b6d/c=2-0-1498-1125/local/-/media/2017/02/27/CarolinaGroup/Asheville/636238105299759258-John-Shore-NEW.jpg?width=540&height=405&fit=crop" style="width:100%"><div class="card-body"><h4 class="card-title text-center">'+ x[3].AgtFirstName + " "+ x[3].AgtLastName+ '</h4><p class="card-text">'
      +'<strong>Tel:</strong>'+ x[3].AgtBusPhone + '<br/>'+ x[3].AgtEmail+'<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English</p></div></div></div></div>')
 
  res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">'
    +'<img class="card-img-top" src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" style="width:100%"><div class="card-body"><h4 class="card-title text-center">'+ x[4].AgtFirstName + " "+ x[4].AgtLastName+ '</h4><p class="card-text">'
      +'<strong>Tel:</strong>'+ x[4].AgtBusPhone + '<br/>'+ x[4].AgtEmail+'<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English</p></div></div></div></div>')
  res.write('</div></div><br/><br/><br/><br/><br/>')
  
  
  res.write('<div class="container">')
  res.write("<p><strong>AGENCY 2</strong></p>")
  res.write("<p><strong>Office Address:</strong> " + z[0].AgncyAddress + " "+ z[0].AgncyCity +   " "  + z[0].AgncyProv + "  " + z[0].AgncyPostal + " " + z[0].AgncyCountry+
   "<br/><strong>Phone: </strong>"+ z[0].AgncyPhone +"<br/><strong>Fax: </strong>" + z[0].AgncyFax +  "</p>");
  res.write('</div>')

 res.write('<div class="container"><div class="row">')
  res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">'
    +'<img class="card-img-top" src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"style="width:100%" /><div class="card-body"><h4 class="card-title text-center">'+ w[0].AgtFirstName + " "+ w[0].AgtLastName+ '</h4><p class="card-text">'
      +'<strong>Tel:</strong>'+ w[0].AgtBusPhone + '<br/>'+ w[0].AgtEmail+'<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English,Punjab</p></div></div></div></div>')
  
  
  res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">'
    +'<img class="card-img-top" src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"style="width:100%" /><div class="card-body"><h4 class="card-title text-center">'+ w[1].AgtFirstName + " "+ w[1].AgtLastName+ '</h4><p class="card-text">'
      +'<strong>Tel:</strong>'+ w[1].AgtBusPhone + '<br/>'+ w[1].AgtEmail+'<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English,Punjab</p></div></div></div></div>')
 

  res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">'
    +'<img class="card-img-top" src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"style="width:100%" /><div class="card-body"><h4 class="card-title text-center">'+ w[2].AgtFirstName + " "+ w[2].AgtLastName+ '</h4><p class="card-text">'
      +'<strong>Tel:</strong>'+ w[2].AgtBusPhone + '<br/>'+ w[2].AgtEmail+'<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English,Punjab</p></div></div></div></div>')
    

  res.write('<div class="col-lg-4 col-sm-6 mb-3"> <div class="thumbnail"><div class="card" style="width:300px">'
    +'<img class="card-img-top" src="https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"style="width:100%" /><div class="card-body"><h4 class="card-title text-center">'+ w[3].AgtFirstName + " "+ w[3].AgtLastName+ '</h4><p class="card-text">'
      +'<strong>Tel:</strong>'+ w[3].AgtBusPhone + '<br/>'+ w[3].AgtEmail+'<br/><strong>Experience:</strong>10+ years <br/><strong>Language(s)</strong>: English,Punjab</p></div></div></div></div>')
  



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
}).listen(2019, ()=>{ console.log("Server is started") });

