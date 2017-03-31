import { Rebrews } from '../../imports/api/collections/coffees.js';
import { Coffees } from '../../imports/api/collections/coffees.js';
import { Rebrew } from '../../lib/DatabaseModels.js';

if(Meteor.isServer){
    Meteor.methods({
    ///favorite structure:
    ///{user: String, name: String}
    'rebrews.add'(rebrew){
      let newRebrew = {};
      newRebrew.Advanced = rebrew.Advanced;
      newRebrew.Rebrew = rebrew.Rebrew;
      newRebrew.Username = Meteor.user().username;
      newRebrew.Owner = Meteor.userId();
      newRebrew.ReviewDate = new Date();
      newRebrew.Aroma = rebrew.Aroma;
      newRebrew.Acidity = rebrew.Acidity;
      newRebrew.Balance = rebrew.Balance;
      newRebrew.Flavour = rebrew.Flavour;
      newRebrew.Body = rebrew.Body;
      newRebrew.CoffeeId = rebrew.CoffeeId;
      newRebrew.CoffeeName = rebrew.CoffeeName;
      newRebrew.Title = rebrew.Title;

      if(newRebrew.Advanced){
      newRebrew.Rating = parseFloat(sumAdvancedRebrew(newRebrew));
      }
      else{
        newRebrew.Rating = rebrew.Rating;
      }
      console.log(newRebrew);
      Rebrews.insert(newRebrew);

      //Recalculate Average Rating
      let advancedRebrews = Rebrews.find({CoffeeId: newRebrew.CoffeeId, Advanced: true}).fetch();
      let simpleRebrews = Rebrews.find({CoffeeId: newRebrew.CoffeeId, Advanced: false}).fetch();

      let average = calculateCoffeeRating(simpleRebrews, advancedRebrews);

      console.log("AVERAGE",average);
      Coffees.update({_id: newRebrew.CoffeeId}, {$set: {AverageRating: average}});
    },
    'rebrews.removeById'(id){
        check( id, Match.OneOf( String, null, undefined ) );
        let brew = Rebrews.findOne({_id: id}).CoffeeName;
        let brewcount = Rebrews.find({CoffeeName: brew}).count() - 1;
        Rebrews.remove(id);

        //Recalculate Average Rating
        if (brewcount > 0 ) {
          let allreviews = Rebrews.find({CoffeeName: brew}).fetch();
          let ratings = _.pluck(allreviews, "Rating");
          let sum = ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
          let average = (sum / ratings.length).toFixed(1);
          Coffees.update(Coffees.findOne({CoffeeName:brew})._id, {$set: {AverageRating: average}});
        } else {
            Coffees.update(Coffees.findOne({CoffeeName:brew})._id, {$set: {AverageRating: brewcount}});
        }
    },
    'rebrews.updateRebrew'(rebrew){

        let rebrewUpdate = new Rebrew(rebrew);
        if (rebrewUpdate.Rating=='') {
          rebrewUpdate.Rating = 0;
        }
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

function calculateCoffeeRating(allSimple, allAdvanced){
  let simpleRatings = _.pluck(allSimple, "Rating");
  let advancedRatings = allAdvanced.map((v,i) => {
    return sumAdvancedRebrew(v);
  });
  console.log(simpleRatings, advancedRatings);
  let sum = 0;
  console.log(advancedRatings);
  if(simpleRatings.length > 0){
    sum += simpleRatings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
  }

  if(advancedRatings.length > 0){
    sum += advancedRatings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
  }

  if(simpleRatings.length + advancedRatings.length < 1){
    throw "Something in your database is really messed up, sir!"
  }
    let average = ((sum) / (simpleRatings.length + advancedRatings.length)).toFixed(1);
    return average;


}

function sumAdvancedRebrew(rebrew){
  return Math.round((
      (parseFloat(rebrew.Aroma) +
       parseFloat(rebrew.Balance) +
       parseFloat(rebrew.Body) +
       parseFloat(rebrew.Flavour) +
       parseFloat(rebrew.Acidity)) / 10) * 2
     ).toFixed(1) / 2;
}
