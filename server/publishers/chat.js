import { Messages } from '../../imports/api/collections/coffees.js';
import { RoomUsers } from '../../imports/api/collections/coffees.js';

if (Meteor.isServer) {
  Meteor.publish('roommessages', function() {
    return Messages.find();
  });
  /* Publish room users by room id */
  Meteor.publish('roomusers', function() {
    return RoomUsers.find();
  });
}