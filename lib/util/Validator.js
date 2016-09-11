'use strict'

class Validator {


	static isInt(nodeId) {

		if ( (typeof nodeId !== 'integer') && (nodeId != '') && (nodeId % 1 == 0) ) {
	
				return true;

			 } else {

				return false;
			}
		
	}

	static isNodeId(nodeId){

			if (this.isInt(nodeId) === false) {
				throw new Error('Node id Must be an integer!');
			}
	}

	static isLabel(label) {

			if (typeof label !== 'string' && label !== '') {
				throw new Error('Label must be non empty string');
			}

	}

	static isProperty(property) {

			if (typeof property !== 'string' || property !== '') {
				throw new Error('Proper must be not empty string.');
			}

	}

	static isProperties(properties) {

			if (typeof properties !== 'object' || properties !== '' ) {
				throw new Error('Properties should be valid json');
			}

	}

	static isTransaction(transaction) {

		if (this.isInt() === false) {
			throw new Error('transaction id must be an integer!');
		}
	}

};

module.exports = Validator;