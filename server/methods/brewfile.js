import { BrewFiles } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    'brewfile.updateImage'(brewfile){
      try{
        var id = BrewFiles.findOne({user: brewfile.user})._id;
        BrewFiles.update({_id: id}, {$set: {imageURL: brewfile.url}})

      }
      catch(e){
        BrewFiles.insert({user: brewfile.user, imageURL: brewfile.url});
      }

      try{
          BrewFiles.update({_id: id}, {$set: {tagline: brewfile.tagline}})
        }
        catch(e){
          BrewFiles.insert({user: brewfile.user, tagline: brewfile.tagline});
        }
    }
  });
}
