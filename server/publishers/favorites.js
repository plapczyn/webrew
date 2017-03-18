import { Favorites } from '../../imports/api/collections/coffees.js';

  if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('favorites', function( user ) {
      check( user, Match.OneOf( String, null, undefined ) );
      return Favorites.find({Username: user});
    });


    Meteor.publish('favorites.isInFavorites', (user) => {
      return Favorites.find({Username: user});
    });
}
