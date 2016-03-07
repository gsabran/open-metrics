import {Mongo} from 'meteor/mongo';

/*
 * Define the collections used to represent the data
 */

/*
 * user: a user on the product, identified by a cookie
 * {uid: sessionId, props: {name: value}* }
 */
export const ClientUsers = new Mongo.Collection('clientusers');

/*
 * event: an event that happened on the product and should be logged
 * {ts: Date.now(), uid: userId, props: {name: value}* }
 */
export const Events = new Mongo.Collection('events');

/*
 * uniqueActiveUser: a user who has been active in a given time range
 * {uid: uid, type: one of [hour, day, week, month], ts: in unix time, in hour, days...}
 */
export const UniqueActiveUsers = new Mongo.Collection('uniqueactiveusers');

/*
 * metric: a metric created. It can be of various types
 * {
 *   title: the title,
 *   desc: the description,
 *   type: one of [total, timeSerie, funnel],
 *        total: {data: value}
 *        timeserie: {timeStep: one of [mn, hour, day, week, month], data: [{tsId: the number of X from Unix time, value}*]
 *        funnel: {data: [{order: the position in the funnel, value: the total value}*]}
 *   unit: one of [%, int, float],
 *   order: order it should be displayed in in the dahsboard,
 *   isRequest: boolean on wether it should make a request, or query the data
 *   script: a raw script to execute to get the result
 *   request: {url, params}: the data for a POST request to make to get additional info
 * }
 */
export const Metrics = new Mongo.Collection('metrics');


/*
 * clientUser: an alias for an Accounts.user
 */
export const Users = Accounts.users;


if (Meteor.isServer) {
  Meteor.startup(function () {
    ClientUsers._ensureIndex({
      uid: 1,
      sessionIds: 1,
    });
    Events._ensureIndex({
      uid: 1,
      ts: 1,
    });
    UniqueActiveUsers._ensureIndex({
      uid: 1,
      type: 1,
      ts: 1,
    });
  });
}
