============================
carbond.limiter.ChainLimiter
============================

:js:class:`~carbond.limiter.ChainLimiter` should be used to insert
series (or tree) of limiters at a given point in the 
:js:class:`~carbond.Endpoint.Endpoint` tree. A request will be evaluated by 
each limiter in the chain in order with evaluation stopping at the first 
limiter that rejects the request.

Class
-----

.. js:class:: carbond.limiter.ChainLimiter

    *extends*: :js:class:`~carbond.limiter.Limiter`

    .. js:attribute:: limiters

        :type: :js:class:`Array`

        An :js:class:`Array` of :js:class:`~carbond.limiter.Limiter`
        instances.

    .. js:function:: initialize(service, node)
        
        :param service: the root ``Service`` instance
        :type service: :js:class:`~carbond.Service`
        :param node: the ``Endpoint`` that we are attached to
        :type node: :js:class:`carbond.Endpoint`
       
        Called on service initialization. Cascades initialization to all limiters
        managed by this instance.

    .. js:function:: process(req, res, next) 

        :param req: the current ``Request`` object
        :type req: :js:class:`express.request`
        :param res: the current ``Response`` object
        :type res: :js:class:`express.response`
        :param next: continuation
        :type next: :js:class:`Function`

        Overrides :js:func:`~carbond.limiter.Limiter.process` to iterate over
        ``limiters`` calling ``process`` on each individual limiter. If a
        limiter in the chain ends the request-response cycle, then
        subsequent limiters will not be evaluated. Similarly, if an error is
        passed to ``next``, processing will stop and the error will be passed on
        to the appropriate error handling middleware.

Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:

