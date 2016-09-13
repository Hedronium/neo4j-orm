'use strict'

var request = require('superagent');
var validator = require('./util/Validator');
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
			this.queryParam = '';

			this.queryError = [];


 
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
			}

			if (i !== j) {

				throw new Error('Number of nodes and number of data object must be same!');
			}


			this.queryString = this.queryString+'CREATE ';

			this.paramProccessingEngine();
			
			return this;
		}

		/**
		 * Proccess all kinds of parameter which will be using in the query
		 * @return {[type]} [description]
		 */
		paramProccessingEngine(){

			let length = this.querynode.length - 1;

			for (var i = 0; i <= length; i++) {


				this.queryString = this.queryString+' (';

				let opQnode = this.querynode[i];
				let opQdata = this.createQueryObject(this.querydata[i]);

				this.queryString = this.queryString + opQnode + '{'+opQdata+'}';
				
				if (length == i) {
					this.queryString = this.queryString+')';
				} else {
					this.queryString = this.queryString+'),';
				}
 
			}

		}

		/**
		 * Returns query results
		 * @param  {[array]} node [description]
		 * @return {[type]}      [description]
		 */
		return (nodes) {
			
			if (nodes.constructor !== Array) {

				throw new Error('parameter must be an array');
			}

			if (typeof nodes == 'undefined') {
				
				this.queryString += ' RETURN ' +this.querynode.join(',');
			
				} else {

				this.queryString += ' RETURN ' +nodes.join(',');
			}
			return this;
		}

		/**
		 * Execute querystring
		 * @return {[type]} [description]
		 */
		exec(callback) {

			if (this.queryType == 0) {

				this.queryString = this.queryString+'CREATE ';
			}

			let length = querynode.length;

			for (var i = 0; i < length; i++) {

				this.queryString = this.queryString+' (';

				let opQnode = this.querynode[i];
				let opQdata = JSON.stringify(this.querydata[i]);

				this.queryString = this.queryString + opQnode + opQdata;

				this.queryString = this.queryString+'),';
			}

/*

		   request.post(this.cypher)
		   .send({query:this.queryString , param: this.paramString })
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
 */

		}


		dump(callback){

			console.log(this.queryString);
		}

		/**
		 * It Sums the output data and creates a more pretty look
		 * @param  {[object]} bodyData
		 * @return {[object || json]}
		 */
		sumData(bodyData) {

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

   			return returnObject;

		}


		createQueryObject(obj) {
		
			  return Object.keys(obj).map((key) => {
			    return `${key}: "${obj[key]}"`;
			  }).join(',');

		}

}

module.exports = Core;