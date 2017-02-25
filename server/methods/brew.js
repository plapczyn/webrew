import { Coffees } from '../../imports/api/collections/coffees.js';
import { Rebrews } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    'coffees.removeById'(id){
      check( id, Match.OneOf( String, null, undefined ) );
      Coffees.remove(id);
      Rebrews.remove({brewid: id});
      Favorites.remove({brewid: id});
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

    },
    'coffees.edit'(brew){
        let brewUpd = {};
        brewUpd.id = brew.id;
        brewUpd.name = brew.name.trim();
        brewUpd.roast = brew.roast.trim();
        brewUpd.imageURL = brew.imageURL.trim();
        brewUpd.description = brew.description.trim();

        if(Coffees.findOne({name: brewUpd.name})){
            if(Coffees.findOne({name: brewUpd.name})._id == brewUpd.id){
                //Update Coffee-no name update
                Coffees.update({_id: brewUpd.id}, {$set: {roast: brewUpd.roast}});
                Coffees.update({_id: brewUpd.id}, {$set: {imageURL: brewUpd.imageURL}});
                Coffees.update({_id: brewUpd.id}, {$set: {description: brewUpd.description}});
                return;
            }else {
                throw "Duplicate";
            }
        }else {
            //Update Coffee-name update
            Coffees.update({_id: brewUpd.id}, {$set: {name: brewUpd.name}});
            Coffees.update({_id: brewUpd.id}, {$set: {roast: brewUpd.roast}});
            Coffees.update({_id: brewUpd.id}, {$set: {imageURL: brewUpd.imageURL}});
            Coffees.update({_id: brewUpd.id}, {$set: {description: brewUpd.description}});
            //Update reBrews
            Rebrews.update({brewid: brewUpd.id}, {$set: {brew: brewUpd.name}},{multi: true});
            return;
        }
    }
  });
}
