.. class:: carbond.limiter.TooBusyLimiter
    :heading:

.. |br| raw:: html

   <br />

==============================
carbond.limiter.TooBusyLimiter
==============================
*extends* :class:`~carbond.limiter.FunctionLimiter`

:class:`~carbond.limiter.TooBusyLimiter` limits connections based on how busy
the process is.

Properties
----------

.. class:: carbond.limiter.TooBusyLimiter
    :noindex:
    :hidden:

    .. ifconfig:: carbonio_env != 'prod'

         .. attribute:: absMaxOutstandingReqs

            :type: Integer
            :required:

            The absolute maximum number of outstanding requests.


    .. attribute:: useFiberPoolSize

        :type: Boolean
        :required:

        Use Fiber's pool size to set absMaxOutstandingReqs.


    .. attribute:: fiberPoolAllowedOverflow

        :type: Number
        :required:

        Allow for more requests than ``Fiber.poolSize`` if limiting on
        ``Fiber.poolSize`` (i.e, ``absMaxOutstandingReqs == fiberPoolOverflow *
        Fiber.poolSize + Fiber.poolSize``). **Note**\, this only applies if
        :attr:`~carbond.limiter.TooBusyLimiter.useFiberPoolSize` is ``true``.


    .. attribute:: toobusyMaxLag

        :type: Integer
        :default: ``70``

        The number of milliseconds Node's event loop must lag to trigger rate
        limiting of future requests.


    .. attribute:: toobusyInterval

        :type: Integer
        :default: ``500``

        The interval at which Node's event loop lag will be tested.


    .. attribute:: maxOutstandingReqs

        :type: Integer
        :ro:

        The current allowed number of outstanding requests.


    .. attribute:: outstandingReqs

        :type: Integer
        :ro:

        The current number of outstanding requests.


Methods
-------

.. class:: carbond.limiter.TooBusyLimiter
    :noindex:
    :hidden:

    .. function:: fn(req, res, next)

        :overrides: :attr:`~carbond.limiter.FunctionLimiter`
        :param req: The current `Request` object
        :type req: express.request
        :param res: The current `Response` object
        :type res: express.response
        :param Function next: Continuation
        :rtype: Boolean

        Evaluates whether the current request should be allowed based on how
        busy the server process is.

        Each time this method is invoked, it will check if the event loop
        appears to be lagging and if the number of outstanding requests is
        greater than ``Fiber`` 's current pool size. A warning will be logged if
        the former is ``true`` and a debug message will be logged if the latter
        is ``true``.

        If the current number of outstanding requests is greater than
        :attr:`maxOutstandingReqs` or the event loop appears to be lagging too
        far behind, the request will be rejected and a ``503`` will be sent to
        the client. If the event loop is lagging, :attr:`maxOutstandingRequests`
        will be updated to reflect the current number of outstanding requests.

        If the request is allowed and :attr:`maxOutstandingReqs` is less than
        :attr:`absMaxOutstandingReqs`, :attr:`maxOutstandingReqs` will increase
        exponentially with each additional request up to
        :attr:`absMaxOutstandingReqs`.

        Finally, :attr:`outstandingReqs` is incremented, a callback is
        registered do decrement the counter on request completion, and control
        is passed to the next handler.


Example
-------

.. .. literalinclude:: <path>
..     :language: js
..     :linenos:


