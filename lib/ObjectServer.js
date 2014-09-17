require('fibers');
var util = require('./util')
var express = require('express')
var fs = require('fs')
var path = require('path')
var url = require('url')
var connect = require('leafnode').connect
var maker = require('maker')
var o = maker.o(module)
var oo = maker.oo(module)
var _o = maker._o(module)

/******************************************************************************
 * @class ObjectServer
 */
module.exports = oo({

    /**********************************************************************
     * port
     */        
    port: 3000,
    
    /**********************************************************************
     * authenticator
     */        
    authenticator: null,

    /**********************************************************************
     * endpoints
     */        
    endpoints: {},

    /**********************************************************************
     * app
     */        
    _app : null,

    /**********************************************************************
     * mongodbURI
     */        
    mongodbURI: null,

    /**********************************************************************
     * db
     */        
    _db : null,
    
    /**********************************************************************
     * _init
     */        
    _init : function(args) {
        console.log("ObjectServer._init()", args)

        var me = this
        util.spawn(function() {
            // initialize db connection
            if (me.mongodbURI) { // XXX maybe make this lazy by making _db property getter
                console.log("initializing connection to db: " + me.mongodbURI)
                try {
                    me._db = connect(me.mongodbURI)
                } catch (e) {
                    console.log(e)
                }
            }
            
            var app = express.createServer()
            me._app = app          

            // configure top-level fiber -- this should be first in the middleware chain
            app.use(function(req, res, next) {
                util.spawn(function() {
                    try {
                        next()
                    } catch (e) {
                        console.error(e.stack)
                    }
                })
            })

            // better than using bodyParser -- more secure to not allow file uploads
            // XXX why does this not work then?
            // app.use(express.json())
            // app.use(express.urlencoded())
            app.use(express.bodyParser()) // XXX do we only want json() and urlencoded()
            // XXX maybe do this after auth?

            // initialize authenticator
            me._initializeAuthenticator()
            app.use(function(req, res, next) {
                if (me.authenticator && req.remoteUser) {
                    var user = me.authenticator.findUserByUsername(req.remoteUser)
                    if (user) {
                        req.user = user
                    } // XXX reject properly
                }
                console.log("Request user: " + req.user) 
                next()
            })

            // add objectserver to the req
            app.use(function(req, res, next) {
                req.objectserver = this
                next()
            })
            
            // router middleware
            app.use(app.router)

            // XXX more general init()?

            // final app.use for error?

            // endpoints
            console.log("initializing API endpoints")
            me._initializeEndpoints()

            app.listen(me.port)
            console.log("objectserver listening on port " + me.port)
        })
    },

    /**********************************************************************
     * _initializeAuthenticator
     */
    _initializeAuthenticator: function() {
        if (this.authenticator) {
            this.authenticator.initialize(this)
        }
    },

    /**********************************************************************
     * _initializeEndpoints
     */
    _initializeEndpoints : function() {
        for (var path in this.endpoints) {
            var endpoint = this.endpoints[path]
            this.endpoints[path].initialize(this, "/" + path)
        }
    },

    /**********************************************************************
     * start
     */        
    start : function() {
        this._init();
    },
    
    /**********************************************************************
     * stop
     */        
    stop : function() {
    }
    
})
