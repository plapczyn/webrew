import { Favorites } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    ///favorite structure:
    ///{user: String, name: String}
    'favorites.add'(favorite){
      Favorites.insert(favorite);
    },
    'favorites.isInFavorites'(user) {
      return Favorites.find({user: user});
    }
  });
}
