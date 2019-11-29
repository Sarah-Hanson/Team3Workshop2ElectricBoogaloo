const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/travelexperts";

mongo.connect(url, { useUnifiedTopology: true }, (err, db)=>{
	if (err)
	{
		throw err;
	} else
	{
		console.log("connected");
		var dbo = db.db("travelexperts");
        var sortFilter = { CustomerId: -1 };
        var clientID = "";
		dbo.collection("customers").find().sort(sortFilter).toArray((err, result)=>{
			if (err) throw err;
            //console.log(result[0].CustomerId);
            clientID = result[0].CustomerId;
			db.close();
		});
	}
});