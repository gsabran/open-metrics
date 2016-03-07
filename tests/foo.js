import {
  getSessionId,
  getOrCreateUser,
  logActivity,
  logEvents,
  setUserId,
  addPropertiesToUser,
} from '../server/lib.js';

var expect = require('chai').expect;

describe("getSessionId", () => {

  it("returns a sessionId", function() {
    const sessionId = 'lqnv872398f'
    const req = {
      headers: {
        cookie: '_cb_ls=1; _SUPERFLY_nosample=1; _metricId='+sessionId
      }
    };
    expect(getSessionId(req)).to.equal(sessionId);
  });

  it("returns nothing sessionId", function() {
    const sessionId = 'lqnv872398f';
    const req = {
      headers: {
        cookie: '_cb_ls=1; _SUPERFLY_nosample=1;'
      }
    };
    expect(getSessionId(req)).to.be.undefined;
  });
});

describe("getOrCreateUser", () => {
  const sessionId = 'lqnv872398f';
  const otherSessionId = '0913runc1efjwn';

  it("returns something", function() {
    expect(getOrCreateUser(sessionId)).to.not.be.undefined;
  });

  it("created a user", function() {
    expect(ClientUsers.find().count()).to.equal(0);
    getOrCreateUser(sessionId);
    expect(ClientUsers.find().count()).to.equal(1);
  });

  it("returns the same user", function() {
    const user = getOrCreateUser(sessionId);
    expect(getOrCreateUser(sessionId)).to.equal(user);
  });
});


