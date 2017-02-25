import { Favorites } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    ///favorite structure:
    ///{user: String, name: String}
    'favorites.add'(favorite){
        favoriteInsert = {};
        favoriteInsert.user = favorite.user;
        favoriteInsert.brewid = favorite.brewid;

        Favorites.insert(favoriteInsert);
    },
    'favorites.isInFavorites'(user) {
      return Favorites.find({user: user});
    }
  });
}
