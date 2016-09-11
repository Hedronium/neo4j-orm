'use strict'

var request = require('superagent');

class index {

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

			this.dbLink = this.url+'/db/data/';
 
 			console.log(this.dbLink);
				   request.get(this.dbLink)
				   .set('Accept', 'application/json')
				   .set('X-Stream','true')
				   .set('Content-Type','application/json')
				   .end(function(err,res){

				   		if (err) {
				   			callback(err);
				   		}

				   		if (res.statusCode == 200) {
				   			callback('200');
				   		}


				   });
 

		}

}

module.exports = index;