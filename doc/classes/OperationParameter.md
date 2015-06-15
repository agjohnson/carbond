class OperationParameter
----------

```Operation```s can optionally define one or more ```OperationParameter```s. Each ```OperationParameter``` can specify the 
location of the parameter (path, query string, or body) as well as a JSON schema definition to which the parameter must conform.

All parameters defined on an ```Operation``` will be available via the ```parameters``` property of  the ```HttpRequest``` object and can be accessed as ```req.parameters[<parameter-name>]``` or ```req.parameters.<parameter-name>```.

Carbond supports both JSON and [EJSON](http://docs.mongodb.org/manual/reference/mongodb-extended-json/) (Extended JSON, which includes support additional types such as ```Date``` and ```ObjectId```). 

Formally defining parameters for operations helps you to build a self-describing API for which the framework can then 
auto-generate API documention and interactive administration tools.

Configuration
----------

```
{
  [_type: carbon.carbond.OperationParameter,]
  [description: <string>],
  [location: <string> ('query' | 'path' | 'body')],
  [schema: <object>] // JSON Schema object (http://json-schema.org/)
  [required: <boolean]
}
```

Properties
----------

* ```description```: A description for this parameter.

* ```location```: The location in which this parameter will be passed. Can be one of ```'query'```, ```'path'```, or ```'body'```.

* ```schema```: A [JSON Schema](http://json-schema.org/) definition. If supplied Carbond will parse the parameter 
as JSON / [EJSON](http://docs.mongodb.org/manual/reference/mongodb-extended-json/) and automaticall validate that incoming data conforms to the schema and report a 403 Error to the client if data violates the schema. If ```null``` or ```undefined``` the defined parameter will not be parsed and will be a raw ```string```. To specify this parameter as an EJSON value of any type, a schema value of ```{}``` should be supplied. <br/><br/>
To support [EJSON](http://docs.mongodb.org/manual/reference/mongodb-extended-json/), we extend JSON Schema to support the following additional types which can be used like other JSON Schema primitives like ```string```: 
   * ```ObjectId```
   * ```Date```
   * ```Timestamp```
   * ```Regex```
   * ```NumberLong```
   * ```Undefined``` 

* ```required```: The parameter is considered required iff this flag is set to ```true```. 

Methods
----------
*none*

Examples
----------

An operation with a string query parameter
```node
{
  get: {
    description: "My hello world operation",
    parameters: {
      message: {
        description: "A message to say to the world",
        location: 'query',
        required: true,
        schema: { type: 'string' }
      }
    }
    service: function(req) {
      return { msg: "Hello World! " + req.parameters.message }
    }
  }
}
```

An operation with a body parameter having a JSON Schema definition
```
{
  post: {
    description: "Adds a Zipcode object to the zipcodes collection",
    parameters: {
      body: {
        description: "A Zipcode object",
        location: 'body',
        required: true,
        schema: { 
          type: 'object',
          properties: {
            _id: { type: 'number' },
            state: { type: 'string' }
          }
        }
      }
    }
    service: function(req) {
      this.objectserver.db.getCollection("zipcodes").insert(req.parameters.body)
    }
  }
}
```
