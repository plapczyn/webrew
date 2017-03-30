import { Messages } from '../../imports/api/collections/coffees.js';
import { RoomUsers } from '../../imports/api/collections/coffees.js';

if (Meteor.isServer) {
  Meteor.publish('roommessages', function() {
    return Messages.find({}, {sort: {creation_date: -1}, limit: 100});
  });
  Meteor.publish('roomusers', function() {
    return RoomUsers.find();
  });
}