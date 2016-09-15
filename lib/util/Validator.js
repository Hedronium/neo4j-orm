'use strict'

class Validator {

	// Check if its and integer or not 
	static isInt(nodeId) {

		if ( (typeof nodeId !== 'integer') && (nodeId != '') && (nodeId % 1 == 0) ) {
	
				return true;

			 } else {

				return false;
			}
		
	}

	// Check for a valid node id
	static isNodeId(nodeId){

			if (this.isInt(nodeId) === false) {
				throw new Error('Node id Must be an integer!');
			}
	}

	// check for a valid label while querying
	static isLabel(label) {

			if (typeof label !== 'string' && label !== '') {
				throw new Error('Label must be non empty string');
			}

	}

	// Check for a valid property
	static isProperty(property) {

			if (typeof property !== 'string' || property !== '') {
				throw new Error('Proper must be not empty string.');
			}

	}

	// Check if the a chunk of properties are valid or not 
	static isProperties(properties) {

			if (typeof properties !== 'object' || properties !== '' ) {
				throw new Error('Properties should be valid json');
			}

	}

	// check for a valid neo4j transaction id
	static isTransaction(transaction) {

		if (this.isInt() === false) {
			throw new Error('transaction id must be an integer!');
		}
	}

	// unique node_id check , it wil check that the node_id exits or not
	// if the passed object hold a key name "node_id" it'll throw false
	static uniqueIdCheck(object){

		if (object.node_id === undefined) {

			return false;

			} else {
		
			return true;
		
		}
	}

	// stringyfy an object , depends on the configuration
	static stringify(object,config) {

			if (config === 'pretty-json') {

				return JSON.stringify(object,null,4);
			
			} else if (config == 'json') {

				return JSON.stringify(object);

			} else {
			
				return object;
			
			}

	}

	static signValidate(sign){

			if ( sign !== '>' && sign !== '<' && sign !== '=>' && sign !== '=<' && sign !== '~=' & sign ) {

					throw new Error('Invalid signature ');
			}

	}

};

module.exports = Validator;