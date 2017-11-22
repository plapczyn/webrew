import { BrewFiles } from '../../imports/api/collections/coffees.js';
import { Brewfile } from '../../lib/DatabaseModels.js';

if(Meteor.isServer){
  Meteor.methods({
    'brewfile.updateProfile'(brewfile){
      let _brewfile = new Brewfile(brewfile);
      if (_brewfile.Username == Meteor.user().username ) {
        try{
          var id = BrewFiles.findOne(_brewfile.OnlyUsername())._id;
          BrewFiles.update({_id: id}, {$set: _brewfile.OnlyImageUrl()});
        }
        catch(e){
          BrewFiles.insert(_brewfile.Get());
        }
        try{
          var id = BrewFiles.findOne(_brewfile.OnlyUsername())._id;
          BrewFiles.update({_id: id}, {$set: _brewfile.OnlyTagline()});
        }
        catch(e){
          BrewFiles.insert(_brewfile.Get());
        }
        try{
          var id = BrewFiles.findOne(_brewfile.OnlyUsername())._id;
          BrewFiles.update({_id: id}, {$set: _brewfile.OnlyEmail()});
        }
        catch(e){
          BrewFiles.insert(_brewfile.Get());
        }
      } else {
        console.log("Update Profile Error From: " + Meteor.user().username);
      }
    }
  });
}
