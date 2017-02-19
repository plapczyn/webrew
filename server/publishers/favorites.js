import { Favorites } from '../../imports/api/collections/coffees.js';

  if (Meteor.isServer) {
    // This code only runs on the server
    Meteor.publish('favorites', function( user ) {
      check( user, Match.OneOf( String, null, undefined ) );
      return Favorites.find({user: user});
    });


    Meteor.publish('favorites.isInFavorites', (user) => {
      // console.log(Favorites.find({user: user}))
      return Favorites.find({user: user});
    });
}
