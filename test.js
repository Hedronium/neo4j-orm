var neo4j = require('./index');

var db = new neo4j({},function(err){

	console.log(err);

});

db.getNodeById(14);