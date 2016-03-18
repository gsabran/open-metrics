import React from 'react';
import {FlowRouter} from 'meteor/kadira:flow-router';
import {mount} from 'react-mounter';
import MainLayout from '../modules/MainLayout.jsx';

// import Dashboard from '../modules/Dashboard.jsx';
// FlowRouter.route('/metrics', {
//   name: 'metrics',
//   action: function() {
//     let uid = Meteor.userId();
//     if (['CCWN57bhyFxxY4AMS', 'FpHW42u8KvyYHQYmq', 'tWSyG42yxF2tZwr8h'].indexOf(uid) === -1)
//       return FlowRouter.go('home');

//     Session.set(PAGE_IS_STATIC, true);
//     Session.set(BG_HEADER_STYLE, 'solid');

//     mount(MainLayout, {content: () => (<Dashboard /> )});
//   },
// });
