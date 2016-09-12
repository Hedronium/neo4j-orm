var neo4j = require('./index');

var db = new neo4j({},function(err){

	console.log(err);

});

/*
db.getNodeById(14,function(err){
	console.log(err);
});
*/
db.cypherQuery({ query:'MATCH (n) RETURN n LIMIT {id}', params: {"id" : 2}},function(err,res){

		console.log(res);
});

 