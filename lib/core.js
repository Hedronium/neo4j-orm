class core {

		constructor (connection) {

			if (typeof connection !== 'object') {
				throw new Error('Connection value must be passed by an object');
			}

			this.host = connection.host;
			this.username = connection.username;
			this.password = connection.password;
			this.port = connection.port || 7474;

		}
}