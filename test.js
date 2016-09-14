var neo4j = require('./index');

var db = new neo4j({},function(err){

	console.log(err);

});

/*
db.getNodeById(14,function(err){
	console.log(err);
});
*/

/*
db.cypherQuery({ query:'MATCH (n) RETURN n LIMIT {id}', params: {"id" : 2}},function(err,res){

		console.log(res);
});
*/


// jodi return korte chao
/*
db.createNode(['n','m','o'],[

{

        name:'Aniruddha',
        skills: 'php,nodejs'
},
{
		name: 'Omran jamal',
		skills: 'markup'

},

{
		name:'Nahiyan Alamgir',
		skills: 'Compiler'
}

]).return(['m']).dump(function(data){

	console.log(data);

});

*/
/*
db.createNode(['n','m','o'],[

{

        name:'Aniruddha',
        skills: 'php,nodejs'
},
{
		name: 'Omran jamal',
		skills: 'markup'

},

{
		name:'Nahiyan Alamgir',
		skills: 'Compiler'
}

]).addlabel(['person','coder']).dump(function(err){

	console.log(err);

});

*/
db.getLabelsByNodeId(14);