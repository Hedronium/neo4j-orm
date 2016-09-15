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

]).return(['m']).exec(function(data){

	console.log(data);

});
 */

 var string =  db.createNode(['n','m','o'],[

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

]).dump(function(err){

	console.log(err);

});



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

]).dump(function(err){

	console.log(err);

});





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



			this.http     = connection.http || 'http://';
			this.host 	  = connection.host || 'localhost';
			this.username = connection.username || 'neo4j';
			this.password = connection.password || '123456';
			this.port 	  = connection.port || '7474';
			this.url 	  = this.http+this.username+':'+this.password+'@'+this.host+':'+this.port;

			// Data source
			this.dbLink   	= this.url+'/db/data/';
			this.relLink  	= this.url+'/db/data/relationship';
			this.nodeIndex 	= this.url+'/db/data/index/node';
			this.relIndex 	= this.url+'/db/data/index/relationship';
			this.extInfo   	= this.url+'/db/data/ext';
			this.relType 	= this.url+'/db/data/relationship/types';
			this.batch 		= this.url+'/db/data/batch';
			this.cypher 	= this.url+'/db/data/cypher';
			this.indexes 	= this.url+'/db/data/schema/index';
			this.constraint = this.url+'/db/data/schema/constraint';
			this.transaction= this.url+'/db/data/transaction';
			this.labels  	= this.url+'/db/data/labels';
			this.nodes 		= this.url+'/db/data/node'














			if (nodes.constructor !== Array) {

		  	   throw new Error('nodes should be in an array');
			}

			if (data.constructor !== Array ) {

				throw new Error('Array should be something');
			}

			if (validator.uniqueIdCheck(data) === true) {

			   throw new Error('There should be no node_id');
			
			}

			// push data into query node
	
			for (var i = 0; i < nodes.length; i++) {

				this.querynode.push(nodes[i]);

			}

			for (var j = 0; j < data.length; j++) {

				this.querydata.push(data[j]);
				data[j].node_id = objectID();
			}

			if (i !== j) {

				throw new Error('Number of nodes and number of data object must be same!');
			}


			this.queryString = this.queryString+'CREATE ';
			
			return this;







*/


//db.getLabelsByNodeId(14);

/*
db.match(['n']).where('n.name','=','Aniruddha').return().exec(function(err,res){

		console.log(err,res);

});
 */
 
 db.matchLabel('n','person').return(['n']).exec(function(err,res){

		console.log(err,res);

});
