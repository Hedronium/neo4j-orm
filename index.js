'use strict'

var request = require('superagent');

class index {

		constructor (connection) {

			if (typeof connection !== 'object') {

				throw new Error('Connection parameters must be passed by an object');
			}

/*
			this.http     = connection.http || 'http://';
			this.host 	  = connection.host || 'locahost';
			this.username = connection.username || 'neo4j';
			this.password = connection.password || '123456';
			this.port 	  = connection.port || '7474';
			this.url 	  = this.http+this.username+':'+this.password+'@'+this.host+':'+this.port;

			this.dbLink = this.url.'/db/data'
 
			request.get(this.dbLink)
				   .set('Accept', 'application/json')
				   .set('X-Stream','true');
 */

		}

}

module.exports = index;