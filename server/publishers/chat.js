import { Messages } from '../../imports/api/collections/coffees.js';
import { RoomUsers } from '../../imports/api/collections/coffees.js';

if (Meteor.isServer) {
  Meteor.publish('roommessages', function() {
    console.log("publish roomMessages");
    return Messages.find();
  });
  /* Publish room users by room id */
  Meteor.publish('roomusers', function() {
    console.log("publish roomUsers");
    return RoomUsers.find();
  });
}