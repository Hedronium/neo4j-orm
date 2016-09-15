'use strict'

class Parser {

	  static parseWhereIn(array) {
	  		let string = '';
	  		let length = array.length;
	  		
	  		for (let i = 0; i < length; i++) {

	  			string += "'"+array[i]+"',";

	  		}

	  	return string.slice(0,-1);

	  }

}

module.exports = Parser;