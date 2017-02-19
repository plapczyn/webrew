import { Coffees } from '../../imports/api/collections/coffees.js';


if(Meteor.isServer){
  Meteor.methods({
    'coffees.removeById'(id){
      check( id, Match.OneOf( String, null, undefined ) );
      Coffees.remove(id);
    },

    'coffees.add'(brew){
      if(!Coffees.findOne({name: brew.name.trim()})){
        let brewInsert = {};

        brewInsert.name = brew.name.trim();
        brewInsert.roast =  brew.roast.trim();
        brewInsert.description =  brew.description.trim();
        brewInsert.imageURL =  brew.imageURL.trim();
        brewInsert.createdAt = new Date();
        brewInsert.owner = Meteor.userId();
        brewInsert.username = Meteor.user().username;

        Coffees.insert(brewInsert);
        return;
      }
      throw "Brew Not Found";

    }
  });
}
