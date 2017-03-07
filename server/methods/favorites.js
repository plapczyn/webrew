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
    },
    'favorites.remove'(brewid, user){
      try{
        var favoriteId = Favorites.findOne({user: user, brewid: brewid})._id;
        Favorites.remove({_id: favoriteId});
      }
      catch(e){
        throw e.message;
      }
    }
  });
}
