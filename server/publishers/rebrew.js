import { Rebrews } from '../../imports/api/collections/coffees.js';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('rebrews', function( brewName ) {
      return Rebrews.find({CoffeeName: brewName },{ sort: { reviewdate: -1 } });
  });
}
