import {
  ClientUsers,
  Events,
  UniqueActiveUsers,
} from '../lib/collections.js';

/*
 * from a session id, get the corresponding user or create a new one
 */
export const getOrCreateUser = (sessionId) => {
  const user = ClientUsers.findOne({sessionIds: sessionId});
  if (user)
    return user;
  var id = ClientUsers.insert({
    sessionIds: [sessionId],
    createdAt: Date.now(),
  });
  ClientUsers.update({_id: id}, {$set: {uid: id}});
  return ClientUsers.findOne({_id: id});
};

/*
 * log the user in all retention buckets for easier queries
 */
const milisecondToHour = 1000 * 60 * 60;
export const logActivity = (user) => {
  // get the number of X since unix time, for X in [hour, day, ...]
  // week is a bit shify since 0 unix time is a Thursday and not a Monday...
  const date = new Date();
  const ts = date.getTime();
  const hour = Math.floor(ts / milisecondToHour);
  const day = Math.floor(hour / 24);
  const week = Math.floor((day + 3) / 7); // Jan 1 1970, unix time, was a thursday
  const month = date.getUTCMonth() + 12 * (date.getUTCFullYear() - 1970);

  // don't block main thread for query that might take some time if there's a lot of data there
  Meteor.setTimeout(() => {
    const insertIfNotExists = (params) => {
      UniqueActiveUsers.update(params, {$set: params}, {upsert: true});
    }
    insertIfNotExists({uid: user.uid, type: 'hour', id: hour});
    insertIfNotExists({uid: user.uid, type: 'day', id: day});
    insertIfNotExists({uid: user.uid, type: 'week', id: week});
    insertIfNotExists({uid: user.uid, type: 'month', id: month});
  });
}

/*
 * create event records, with optional properties
 */
export const logEvents = (user, events) => {
  for (var event of events) {
    Events.insert({
      ts: event.ts,
      uid: user.uid,
      props: event.props || {},
    })
  }
}

/*
 * change the current user's id, and handle conflicts
 */
export const setUserId = (user, newId) => {
  const currentUid = user.uid;
  const conflictingUser = ClientUsers.findOne({uid: newId});

  if (conflictingUser && conflictingUser._id === user._id)
    return;

  if (conflictingUser) {
    // then delete current user, and add its data to exitsing one (might overwrite properties)
    ClientUsers.update({_id: conflictingUser._id}, {
      $push: {sessionIds: {$each: user.sessionIds}},
      $set: {props: {...conflictingUser.props, ...user.props}}
    });
    ClientUsers.remove({_id: user._id});
  } else {
    // then simply change current user's uid
    ClientUsers.update({uid: user.uid}, {$set: {uid: newId}}); 
  }
  // update the uid field of related events
  Events.update({uid: currentUid}, {$set: {uid: newId}}, {multi: true});
  UniqueActiveUsers.update({uid: currentUid}, {$set: {uid: newId}}, {multi: true});
}

/*
 * add properties to the current user
 */
export const addPropertiesToUser = (user, properties = {}) => {
  var update = {};
  for (var propertyName in properties) {
    update['prop.'+propertyName] = properties[propertyName];
  }
  ClientUsers.update({uid: user.uid}, {$set: update}); 
}
