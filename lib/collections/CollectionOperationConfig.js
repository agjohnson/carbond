var _ = require('lodash')

var _o = require('@carbon-io/carbon-core').bond._o(module);
var o = require('@carbon-io/carbon-core').atom.o(module);
var oo = require('@carbon-io/carbon-core').atom.oo(module);

/******************************************************************************
 * @class CollectionOperationConfig
 */
module.exports = oo({

  /**********************************************************************
   * _C
   */
  _C: function() {
    this.description = undefined
    this.allowUnauthenticated = false
    this.parameters = {}
    this.responses = []
    this.endpoint = null
  },
  
  /**********************************************************************
   * _init
   */
  _init: function() {
    this._initializeParameters()
  },

  /**********************************************************************
   * _initializeParameters
   */       
  _initializeParameters: function() {
    var parameters = this.parameters
    // Bind to proper class if needed and set name on object
    var OperationParameter = _o('../OperationParameter')
    for (var parameterName in parameters) {
      var parameter = parameters[parameterName]
      if (!(parameter instanceof OperationParameter)) {
        parameter = o(parameter, OperationParameter)
        parameters[parameterName] = parameter // set it back
      }
      parameter.name = parameterName
    }
  },

})

