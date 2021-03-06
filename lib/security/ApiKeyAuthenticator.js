var o = require('@carbon-io/carbon-core').atom.o(module)
var oo = require('@carbon-io/carbon-core').atom.oo(module)

var auth = require('basic-auth')
var ObjectIdGenerator = require('../ObjectIdGenerator')
var EJSON = require('@carbon-io/carbon-core').ejson

/******************************************************************************
 * @class ApiKeyAuthenticator
 */
module.exports = oo({

  /**********************************************************************
   * _type
   */     
  _type: './Authenticator',
  
  /**********************************************************************
   * _C
   */  
  _C: function() {
    this.apiKeyParameterName = "Api-Key"
    this.apiKeyLocation = "header" // can be "header" or "query"
    this.idGenerator = o({
      _type: ObjectIdGenerator,
      generateStrings: true
    })
  },

  /**********************************************************************
   * authenticate
   */        
  authenticate: function(req) {
    this.service.logDebug("ApiKeyAuthenticator.authenticate()")

    var result = undefined
    var apiKey = undefined

    var apiKeyParameterName = this.apiKeyParameterName
    var apiKeyLocation = this.apiKeyLocation || "header"
    if (apiKeyLocation === "header") {
      apiKey = req.header(apiKeyParameterName) 
    } else if (apiKeyLocation === "query") {
      apiKey = req.query[apiKeyParameterName]
    } else {
      throw new this.service.errors.InternalServerError("Malformed authenticator configuration -- " +
                                                        "'apiKeyLocation' must be one of 'header' or 'query'")
    }
    
    this.service.logDebug("ApiKeyAuthenticator.authenticate(): Key name: " + apiKeyParameterName)
    this.service.logDebug("ApiKeyAuthenticator.authenticate(): Key location: " + apiKeyLocation)
    this.service.logDebug("ApiKeyAuthenticator.authenticate(): Key value: " + apiKey)
    if (apiKey) {
      try {
        result = this.findUser(apiKey)
        this.service.logDebug("ApiKeyAuthenticator.authenticate(): Key: ***** " +
                              ", User: " + EJSON.stringify(result))
      } catch (e) {
        this.service.logError("Problem finding user from api key: ***** " + " -- " + e.stack)
        throw new this.service.errors.InternalServerError("Could not authenticate user.")
      }
      if (!result) {
        this.throwUnauthenticated()
      }
    }

    return result
  },
  
  /**********************************************************************
   * generateApiKey
   */        
  generateApiKey: function() {
    var idGenerator = this.idGenerator || o({
      _type: carbon.carbond.ObjectIdGenerator,
      generateStrings: true
    })

    return idGenerator.generateId()
  },

  /**********************************************************************
   * getAuthenticationHeaders
   */        
  getAuthenticationHeaders: function() {
    var result = []
    if (this.apiKeyLocation === "header") {
      result.push(this.apiKeyParameterName)
    }
    return result
  },

  /**********************************************************************
   * findUser
   */       
  findUser: function(apiKey) {}

})
