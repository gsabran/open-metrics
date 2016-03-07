import {
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
      get: function(cb) {
        Picker.route(route, function(params, req, res) {
          console.log('request', JSON.parse(params.query.q));
          if (req.method == 'GET') {
            res.setHeader('Access-Control-Allow-Origin', '*');
            cb(JSON.parse(params.query.q), req, res);
          }
        });
      }
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
 * simple route to test server availability
 */
Router.route('/v1/ping')
  .get(function(params, req, res) {
    res.end('pong');
  });

/*
 * Start to track a session, even before an event is logged
 */
Router.route('/v1/createUser')
  .get(function(params, req, res) {
    var sessionId = params.sessionId;
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
  .get(function(params, req, res) {
    var sessionId = params.sessionId;
    if (!sessionId)
      return fail('no session ID', res);

    const user = getOrCreateUser(sessionId);
    logEvents(user, params.events);
    logActivity(user);
    res.end('ok');
  });

/*
 * change the current session's user id
 * and handle conflicts
 */
Router.route('/v1/setUserId')
  .get(function(params, req, res) {
    var sessionId = params.sessionId;
    if (!sessionId)
      return fail('no session ID', res);

    const user = getOrCreateUser(sessionId);
    setUserId(user, params.uid);

    res.end('ok');
  });

/*
 * Assign some properties to the current user
 */
Router.route('/v1/setUserProps')
  .get(function(params, req, res) {
    var sessionId = params.sessionId;
    if (!sessionId)
      return fail('no session ID', res);

    const user = getOrCreateUser(sessionId);
    addPropertiesToUser(user, params.props);

    res.end('ok');
  });

