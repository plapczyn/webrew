import { RatingNotes } from '../../imports/api/collections/coffees.js';

  if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('ratingNotes', function( ) {
      return RatingNotes.find();
    });
}
