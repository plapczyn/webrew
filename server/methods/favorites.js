import { Favorites } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    ///favorite structure:
    ///{user: String, name: String}
    'favorites.add'(favorite){
      Favorites.insert(favorite);
    },
    'favorites.isInFavorites'(brew) {
      // console.log(Meteor.user());
      let user = Meteor.user().username;
      // console.log(user);
      // console.log(Meteor.user());
      // check( user, Match.OneOf( String, null, undefined ) );
      // return Favorites.find({user: user, name: brew});
      return "I just got back from the method";
    }
  });
}
