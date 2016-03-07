import {
  getSessionId,
  getOrCreateUser,
  logActivity,
  logEvents,
  setUserId,
  addPropertiesToUser,
} from './lib.js';

// an helper for REST requests
Router = {
  route: function(route) {
    return {
      post: function(cb) {
        Picker.route(route, function(params, req, res) {
          if (req.method == 'POST') {
            var body = '';
            req.on('data', function (data) {
              body += data;
              // Too much POST data, kill the connection!
              // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
              if (body.length > 1e6)
                req.connection.destroy();
            });
            req.on('end', Meteor.bindEnvironment(function () {
              req.body = JSON.parse(body);
              cb(params, req, res);
            }));
          }
        });
      },
    }
  }
};

/*
 * return a 401 response
 */
const fail = (message, res) => {
  res.writeHead(401);
  res.end(message);
}


/*
 * Start to track a session, even before an event is logged
 */
Router.route('/v1/createUser')
  .post(function(params, req, res) {
    var sessionId = getSessionId(req);
    if (!sessionId)
      return fail('no session ID', res);

    const user = getOrCreateUser(sessionId);
    logActivity(user);

    res.end('ok');
  });

/*
 * log an array of events
 */
Router.route('/v1/events')
  .post(function(params, req, res) {
    var sessionId = getSessionId(req);
    if (!sessionId)
      return fail('no session ID', res);

    const user = getOrCreateUser(sessionId);
    logEvents(user, req.body.events);
    logActivity(user);

    res.end('ok');
  });

/*
 * change the current session's user id
 * and handle conflicts
 */
Router.route('/v1/setUserId')
  .post(function(params, req, res) {
    var sessionId = getSessionId(req);
    if (!sessionId)
      return fail('no session ID', res);

    const user = getOrCreateUser(sessionId);
    setUserId(user, req.body.uid);

    res.end('ok');
  });

/*
 * Assign some properties to the current user
 */
Router.route('/v1/setUserProps')
  .post(function(params, req, res) {
    var sessionId = getSessionId(req);
    if (!sessionId)
      return fail('no session ID', res);

    const user = getOrCreateUser(sessionId);
    addPropertiesToUser(user, req.body.props);

    res.end('ok');
  });

