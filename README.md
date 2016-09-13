# neo4j-orm
a query builder for neo4j

## Installation
> Grab it using npm.

```bash
npm install -g neo4j-orm
```

# Usage #

You can start working just requring it.

```js
var neo4j = require('neo4j-orm');
```

#### Create Connection #

You can Connect neo4j without object parameters if you have username neo4j and password neo4j like this just calling. 

```js
var db =  new neo4j();
```
OR 

```js

var db =  new neo4j({

 connection.host = 'localhost',
 connection.username = 'neo4j',
 connection.password = '123456',
 connection.port     = '7474',
 
},function(err){
 // callback is optional
});
```

 `Note:` it'll create a `node_id` just like mongo's object_id to create uniquness among created nodes, it'll throw an error if you want to add node_id in the object 


#### Create single node #
You have to call `exec()` to execute the query 

```js

db.createNode(['n'],{

	{
		name:'Aniruddha',
		skills: 'php,nodejs'
	}

}).exec();

```

#### Create multiple node #
You can add as many node you want with a single query

```js

db.createNode(['n','m','o'],{

	{
		name:'Aniruddha',
		skills: 'php,nodejs'
	} , 
	{
	  name: 'Omran jamal',
	  skills: 'php,nodejs,markup'
	},
	{
	 name: 'nahiyan alamgir',
	 skills: 'JS,compiler development'
	}

}).exec();

```

#### Return node #
You have to call `return()` to execute the query 

```js

db.createNode(['n'],{

	{
		name:'Aniruddha',
		skills: 'php,nodejs'
	}

}).return().exec();

```
or you can specify with node data you want in return by passing array like `return([])`

```js

db.createNode(['n'],{

	{
		name:'Aniruddha',
		skills: 'php,nodejs'
	}

}).return(['n']).exec();

```


