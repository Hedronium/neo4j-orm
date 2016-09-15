'use strict'

var request = require('superagent');
var validator = require('./util/Validator');
var parser 	  = require('./util/Parser');
var objectID = require('bson-objectid');

class Core {

		constructor (connection,callback) {

			if (typeof connection !== 'object') {

			   callback(new Error('Connection parameters must be passed by an object'));
			}


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



			// query string 
			this.querynode = [];
			this.querydata = [];

			// if o = create , 1 = match
			this.queryType = 0;


			this.queryString = '';
			this.queryParam = {};

			// if where is not called once the value of this.wherehit = 1
			this.wherehit = 0;
			this.whereString = '';
			this.returnString = '';
			this.limitString = '';
			this.skipString = '';

			this.label  = '';



			// realtion string

			this.relationshipString = '';

 
			   request.get(this.dbLink)
			   .set('Accept', 'application/json')
			   .set('X-Stream','true')
			   .set('Content-Type','application/json')
			   .end(function(err){

			   		if (typeof callback == 'function') {

				   		if (err) {
				   			callback(err.response.error);
				   		}

			   		}

			   });

			 // this will determine pretty output settings , 3 types , output,json,pretty-json
 			 this.output = connection.output || 'object';

		}

		/**
		 * Cypher query
		 * @param  {[object]}   queryObject
		 * @param  {Function} callback
		 * @return {[type]}               [description]
		 */
		cypherQuery(queryObject,callback){
			let link = this.cypher;

			//{ query:'MATCH (n) RETURN n LIMIT {id}', params: {"id" : 1}}
			
			let query = JSON.stringify(queryObject);

			   request.post(link)
			   .send(query)
			   .set('Accept', 'application/json')
			   .set('X-Stream','true')
			   .set('Content-Type','application/json')
			   .end(function(err,res){


			   	if (typeof callback == 'function') {
				   		if (err) {

				   			callback(err,null);

				   		} else {

				   			let returnObject = {};
				   			let i = 0;
				   			res.body.data.forEach(function(data) {
				   				//let key = 'key'+i;
				   			
				   				let internalData = res.body.data[i];
				   				let columns  	 = res.body.columns;
				   				let labels 		 = internalData[0].metadata.labels;
				   				let id 			 = internalData[0].metadata.id;
				   				let datas 		 = internalData[0].data;

				   				let mergedObejct = {
				   					node_columns:columns,
				   					internal_id: id,
				   					node_data: datas,
				   				    node_labels:labels
				   				};


				   				returnObject[i] = mergedObejct;
				   				i++;
				   			
				   			});

				   			callback(null,validator.stringify(returnObject,this.output));
				   		}
			   	}
			   
			   });
 
		}


		getLabelByNodeId(node_id){

			let link = this.nodes+'/'+node_id+'/labels';


			   request.get(link)
			   .set('Accept', 'application/json')
			   .set('X-Stream','true')
			   .set('Content-Type','application/json')
			   .end((err,res) => {

			   	if (typeof callback == 'function') {
					
					if (err) {
			   			
			   			callback(err.response.error,null);
			   		
			   			} else {

			   			callback(null,res.body);
			   		}					

				}

			   });


		}


		getRelationshipById(){


		}

		getTransaction(){


		}

		/**
		 * Returns nodes 
		 * @param  {[type]}   node_id  [description]
		 * @param  {Function} callback [description]
		 * @return {[type]}            [description]
		 */
		getNodeById(node_id, callback) {

			validator.isNodeId(node_id);
			let link = this.nodes+'/'+node_id;


			   request.get(link)
			   .set('Accept', 'application/json')
			   .set('X-Stream','true')
			   .set('Content-Type','application/json')
			   .end((err,res) => {

			   	if (typeof callback == 'function') {
					
					if (err) {
			   			
			   			callback(err.response.error,null);
			   		
			   			} else {

			   			callback(null,res.body);
			   		}					

				}

			   });
		}

		/**
		 * Delete node by single node id 
		 * @param  {[integer]} node_id [description]
		 * @return {[function]}         [callbacks]
		 */
		deleteNodeById(node_id,callbacks) {

			validator.isNodeId(node_id);
			let link = this.nodes+'/'+node_id;
			request.delete(link)
				   .set('Accept', 'application/json')
				   .set('X-Stream','true')
				   .set('Content-Type','application/json')
				   .end((err,res) => {

				   	 if ( typeof callbacks == 'function' ) {

				   		if (err) {
				   			
				   			callback(err.response.error,null);
				   			
				   			} else {

				   			callback(null,res.body);
				   		}


				   	 }

		    });

		}

		/**
		 * Create node , creates an node_id
		 * @param  {[array of string]} node [node variable]
		 * @return {[pointer]}      [return this pointer]
		 */
		createNode(nodes,data) {

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
		}

 		/**
 		 * Create realtion ship query
 		 * @param  {[string]} node1        [description]
 		 * @param  {[string]} node2        [description]
 		 * @param  {[string]} relationName [description]
 		 * @param  {[string]} relvar       [description]
 		 * @return {[this]}              [description]
 		 */
 		createRelation(node1,node2,relationName,relvar) {

 			this.relationshipString = ' CREATE ('+node1+')-['+relvar+':'+relationName+']->('+node2+')';
 			return this;
 		}

		/**
		 * Proccess all kinds of global variables which will be using in the query
		 */
		paramProccessingEngine(){

			let keys = [];
			let value = [];


			let datalength = this.querydata.length;

			for (var i = 0; i < datalength; i++) {

					for(var k in this.querydata[i]){

						keys.push((k+i));

						value.push(this.querydata[i][k]);
					}


			}

			let newLength = keys.length;

			for (var i = 0; i < newLength; i++) {

				this.queryParam[keys[i]] = value[i];
			}
 
			let length = this.querynode.length - 1;

			for (var i = 0; i <= length; i++) {


				this.queryString = this.queryString+' (';

				let opQnode = this.querynode[i];
				let opQdata = '';

				if (datalength != 0) {

					opQdata += this.createQueryObject(this.querydata[i],i);
				
				}

				this.queryString += opQnode +this.label+ '{'+opQdata+'}';
				
				if (length == i) {
					this.queryString += ')';
				} else {
					this.queryString = this.queryString+'),';
				}
			}

				this.queryString += this.whereString;
				this.queryString += this.limitString;
				this.queryString += this.skipString;

				this.queryString += this.returnString;
 
		}

		/**
		 * add mutiple labels
		 * @param  {[type]} label [description]
		 * @return {[this]}       [description]
		 */
		addlabels(label) {

			if ( label.constructor !== Array ) {

				throw new Error('label data must be a array of string');
			
				} else {


					for ( var i = 0; i < label.length; i++ ){

						this.label += ':'+label[i];

					}

			}

			return this;

		}


		/**
		 * Add label 
		 * @param  {[string]} label [description]
		 * @return {[this]}       [description]
		 */
		addlabel(label) {

			if ( typeof label !== 'string' ) {

				throw new Error('label data must be a string');
			
				} else {	

				this.label = label;
			}

			return this;

		}



		/**
		 * it's takes objects and produce a simple output data by proccessing
		 */
		outputProccessingEngine() {


		}

		/**
		 * Returns query results
		 * @param  {[array]} node [description]
		 * @return {[type]}      [description]
		 */
		return (nodes) {
			

			if (typeof nodes === 'undefined') {
				
				this.returnString += ' RETURN ' +this.querynode.join(',');
			
				} else {

				if (nodes.constructor !== Array) {

					throw new Error('parameter must be an array in return()');
				}

				this.returnString += ' RETURN ' +nodes.join(',');
			}

			return this;
		}

		/**
		 * Execute querystring
		 * @return {[type]} [description]
		 */
		exec(callback) {
			   var that = this;
			   this.paramProccessingEngine();

			   request.post(this.cypher)
			   .send({query:this.queryString , params: this.queryParam })
			   .set('Accept', 'application/json')
			   .set('X-Stream','true')
			   .set('Content-Type','application/json')
			   .end(function(err,res){

				   		if (err) {
				   			
				   			callback(err.response.error,null);
				   		
				   			} else {

				   			if (res.body.data !== undefined) {

				   				callback(null,that.sumData(res.body));

				   			} else {

				   				callback(null,'Query results empty!');
				   			}
				   			
				   		}

				   });

			   this.destroy();

		}


		dump(callback){

			this.paramProccessingEngine();

			if (typeof callback == 'function') {

					callback(JSON.stringify({query:this.queryString , params: this.queryParam },null,4));
			}
			this.destroy();
		}

		/**
		 * It Sums the output data and creates a more pretty look
		 * @param  {[object]} bodyData
		 * @return {[object || json]}
		 */
		sumData(bodyData) {

   			let returnObject = {};
   			let i = 0;
   			bodyData.data.forEach(function(data) {
   				//let key = 'key'+i;
   			
   				let internalData = bodyData.data[i];
   				let columns  	 = bodyData.columns;
   				let labels 		 = internalData[0].metadata.labels;
   				let id 			 = internalData[0].metadata.id;
   				let datas 		 = internalData[0].data;

   				let mergedObejct = {
   					node_columns:columns,
   					internal_id: id,
   					node_data: datas,
   				    node_labels:labels
   				};


   				returnObject[i] = mergedObejct;
   				i++;
   			
   			});

   			return returnObject;

		}

		/**
		 * Iterates throgh object
		 * @param  {[object]} obj 
		 * @param  {[integer]} i
		 * @return {[object]} 
		 */
		createQueryObject(obj,i) {

			  if (typeof obj !== 'undefined') {
				  	return Object.keys(obj,i).map((key) => {
				  	    return `${key}: {${key}${i}}`;

				  }).join(',');
			  }

			  return obj;
		}

		/**
		 * Get Node data using labels
		 * @param  {[int]} node_id [description]
		 * @return {[JSON]} [description]
		 */
		getLabelsByNodeId(node_id) {

			validator.isNodeId(node_id);
			//http://localhost:7474/db/data/node/423/labels
			let link = this.nodes+'/'+node_id+'/node';

			   request.get(link)
			   .set('Accept', 'application/json')
			   .set('X-Stream','true')
			   .set('Content-Type','application/json')
			   .end(function(err,res){

				   		if (err) {
				   			
				   			callback(err.response.error,null);
				   		
				   			} else {

				   			callback(null,res);
				   		}

				   });

		}



		/**
		 * Returns All the data in the label
		 * @param  {[string]} label [description]
		 * @return {[json]}       [description]
		 */
		getDataByLabels(label) {

			validator.isLabel(label);
			//http://localhost:7474/db/data/label/Actor/nodes
			let link = this.dbLink+'/label/'+label+'/nodes';

			   request.get(link)
			   .set('Accept', 'application/json')
			   .set('X-Stream','true')
			   .set('Content-Type','application/json')
			   .end(function(err,res){

				   		if (err) {
				   			
				   			callback(err.response.error,null);
				   		
				   			} else {

				   			callback(null,res);
				   		}

				   });

		}

		/**
		 * Match data , it put the array value into nodes for getting it ready for query string building
		 * @param  {[array]} node [description]
		 * @param  {[object]} data [description]
		 * @return {[this]}      [description]
		*/
		
		match(nodes,data) {

			if (  typeof nodes !== 'undefined' ) {

				if (nodes.constructor !== Array) {

				  	   throw new Error('nodes should be in an array');
					}

					if (typeof data !== 'undefined') {

						if (data.constructor == Array) {

							throw new Error(' data should be an array of objects');

						}

							for (var j = 0; j < data.length; j++) {

								this.querydata.push(data[j]);
							}

						}
					// push data into query node
			
					for (var i = 0; i < nodes.length; i++) {

						this.querynode.push(nodes[i]);

					}


				} else {

				  throw new Error('a parameter must be sent into match()');
				}

			this.queryString = this.queryString+'MATCH ';
			
			return this;

		}


		/**
		 * Neo4j's where clause feature , if the this.wherehit = 1, then "WHERE " with not be printed
		 * @param  {[string]} column [description]
		 * @param  {[string]} sign   [description]
		 * @param  {[string]} value  [description]
		 * @return {[this]}        [description]
		 */
		where(column,sign,value) {

			if (typeof column !== 'stirng' && typeof sign !== 'string' && typeof value !== 'string') {

				throw new Error('all parameters must be string..');

			}

			validator.signValidate(sign);

			if (this.wherehit == 0) {

				this.whereString += " WHERE " + column+ sign+"'"+value+"'";
				
					} else {

					this.whereString += " AND " + column+ sign+"'"+value+"'";
				}

			this.wherehit = 1;
			return this;

		}

		/**
		 * This represent the WHERE IN feature in neo4j 
		 * @param  {[string]} column [description]
		 * @param  {[array]} value  [description]
		 * @return {[this]}        [description]
		 */
		whereIn(column,value) {

			if (typeof column !== 'string') {

				throw new Error('First parameter must be a stirng');
			}

			if (value.constructor !== Array) {

			 	throw new Error('Second parameter must be an array');
			}
			
//			parser.parseWhereIn(value);
			
			if (this.wherehit == 0) {

				this.whereString += " WHERE " + column+ " IN "+"["+parser.parseWhereIn(value)+"]";
				
					} else {

				this.whereString += " AND " + column+ " IN "+"["+parser.parseWhereIn(value)+"]";
			}

			return this;

		}

		/**
		 * 
		 * @return {[type]} [description]
		 */
		whereStarts() {



		}

		/**
		 * Match labels
		 * @param  {[node]} node  [description]
		 * @param  {[type]} label [description]
		 * @return {[type]}       [description]
		 */
		matchLabel(node,label) {

			if ( typeof node !== 'string' ){

				throw new Error('node must be a string.');
			}

			if (typeof label !== 'string') {

				throw new Error('Label must be a string.');
			}

			this.queryString = 'MATCH ('+node+':'+label+')';

			return this;

		}

		/**
		 * Setting all the global variable to null
		 */
		destroy(){

			// query string 
			this.querynode = [];
			this.querydata = [];

			// if o = create , 1 = match
			this.queryType = 0;


			this.queryString = '';
			this.queryParam = {};

			// if where is not called once the value of this.wherehit = 1
			this.wherehit = 0;
			this.whereString = '';
			this.returnString = '';

			this.label  = '';

		}

		/**
		 * Putting limit into query
		 * @return {[this]} [description]
		 */
		limit(int) {

			this.limitString = " LIMIT {"+int+"}";
			return this;
		}

		/**
		 * putting skip into query
		 * @return {[this]} [description]
		 */
		skip(int){

			this.skipString = " SKIP {"+int+"}";
			return this
		}

		createpath(nodes,data,rel1,rel2,at) {

			if (nodes.constructor !== Array) {

				throw new Error('Nodes must be in array');
			}

			if (data.constructor !== Array) {

				throw new Error('Datas must be a array of object');
			}

			if ( nodes.length !== 2 || data.length !== 2 ) {

				throw new Error('Nodes and datas should have 2 items each');
			}

			if (typeof rel1 !== 'string' || typeof rel2 !== 'string' || typeof at !== 'string') {

				throw new Error('All parameters must be a string.');
			}

			

		}

		pathParamProcessingEngine(){



		}

/*
MATCH (n{name:'Omran'})--(KNOWS)
RETURN KNOWS
 */



}

module.exports = Core;