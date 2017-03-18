import { Rebrews } from '../../imports/api/collections/coffees.js';
import { Coffees } from '../../imports/api/collections/coffees.js';
import { Rebrew } from '../../lib/DatabaseModels.js';

if(Meteor.isServer){
    Meteor.methods({
    ///favorite structure:
    ///{user: String, name: String}
    'rebrews.add'(rebrew){
      let newRebrew = new Rebrew(rebrew);
      newRebrew.Username = Meteor.user().username;
      newRebrew.Owner = Meteor.userId();
      newRebrew.ReviewDate = new Date();

      Rebrews.insert(newRebrew.Get());

      //Recalculate Average Rating
      let allreviews = Rebrews.find({CoffeeId: newRebrew.OnlyCoffeeId().CoffeeId}).fetch();
      let ratings = _.pluck(allreviews, "Rating");
      let sum = ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
      let average = (sum / ratings.length).toFixed(1);
      Coffees.update({_id: newRebrew.OnlyCoffeeId().CoffeeId}, {$set: {AverageRating: average}});
    },
    'rebrews.removeById'(id){
        check( id, Match.OneOf( String, null, undefined ) );
        let brew = Rebrews.findOne({_id: id}).brew;
        let brewcount = Rebrews.find({brew: brew}).count() - 1;
        Rebrews.remove(id);

        //Recalculate Average Rating
        if (brewcount > 0 ) {
          let allreviews = Rebrews.find({brew: brew}).fetch();
          let ratings = _.pluck(allreviews, "rating");
          let sum = ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
          let average = (sum / ratings.length).toFixed(1);
          Coffees.update(Coffees.findOne({name:brew})._id, {$set: {averageRating: average}});
        } else {
            Coffees.update(Coffees.findOne({name:brew})._id, {$set: {averageRating: brewcount}});
        }
    },
    'rebrews.updateRebrew'(rebrew){

        let rebrewUpdate = new Rebrew(rebrew);
        try{
            Rebrews.update(rebrewUpdate.Only_id(), {$set: rebrewUpdate.OnlyTitle()});
            Rebrews.update(rebrewUpdate.Only_id(), {$set: rebrewUpdate.OnlyRating()});
        }
        catch(e){
        }

        try{
            Rebrews.update(rebrewUpdate.Only_id(), {$set: rebrewUpdate.OnlyRebrew()});
        }
        catch(e){
        }
        try{
            Rebrews.update(rebrewUpdate.Only_id(), {$set: rebrewUpdate.OnlyRebrew()});
        }
        catch(e){
        }

        //Recalculate Average Rating
        let brew = Rebrews.findOne(rebrewUpdate.Only_id()).CoffeeName;
        let allreviews = Rebrews.find({CoffeeName: brew}).fetch();
        let ratings = _.pluck(allreviews, "Rating");
        let sum = ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
        let average = (sum / ratings.length).toFixed(1);
        Coffees.update(Coffees.findOne({CoffeeName: brew})._id, {$set: {AverageRating: average}});
    }
  });
}
