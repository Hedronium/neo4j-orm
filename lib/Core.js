'use strict'

var request = require('superagent');
var validator = require('./util/Validator');

class Core {

		constructor (connection,callback) {

			if (typeof connection !== 'object') {

			   callback(new Error('Connection parameters must be passed by an object'));
			}


			this.http     = connection.http || 'http://';
			this.host 	  = connection.host || 'localhost';
			this.username = connection.username || 'neo4j';
			this.password = connection.password || '12345';
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
 
			   request.get(this.dbLink)
			   .set('Accept', 'application/json')
			   .set('X-Stream','true')
			   .set('Content-Type','application/json')
			   .end(function(err){

			   		if (err) {
			   			callback(err.response.error);
			   		}

			   });
 

		}


		getNodeById(node_id,callback) {

			validator.isNodeId(node_id);
			let link = this.nodeIndex+'/'+node_id;

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


}

module.exports = Core;