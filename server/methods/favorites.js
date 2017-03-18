import { Favorites } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    ///favorite structure:
    ///{user: String, name: String}
    'favorites.add'(favorite){
        favoriteInsert = {};
        favoriteInsert.Username = favorite.Username;
        favoriteInsert.CoffeeId = favorite.CoffeeId;

        Favorites.insert(favoriteInsert);
    },
    'favorites.isInFavorites'(user) {
      return Favorites.find({Username: user});
    },
    'favorites.remove'(brewid, user){
      try{
        var favoriteId = Favorites.findOne({Username: user, CoffeeId: brewid})._id;
        Favorites.remove({_id: favoriteId});
      }
      catch(e){
        throw e.message;
      }
    }
  });
}
