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
        newRebrew.Rating = Number(rebrew.Rating);
      }
      Rebrews.insert(newRebrew);
      //Recalculate Average Rating
      let advancedRebrews = Rebrews.find({CoffeeId: newRebrew.CoffeeId, Advanced: true}).fetch();
      let simpleRebrews = Rebrews.find({CoffeeId: newRebrew.CoffeeId, Advanced: false}).fetch();
      
      let average = calculateCoffeeRating(simpleRebrews, advancedRebrews);

      Coffees.update({_id: newRebrew.CoffeeId}, {$set: {AverageRating: average}});
      //Recalculate Advanced Average Ratings
      advancedRebrews = Rebrews.find({CoffeeId: newRebrew.CoffeeId, Advanced: true}).fetch();
      if(advancedRebrews.length < 1)
      {
        return;
      }
      
      let AvgAroma = calculateAdvancedAvg(advancedRebrews, 'Aroma');
      let AvgAcidity = calculateAdvancedAvg(advancedRebrews, 'Acidity');
      let AvgBalance = calculateAdvancedAvg(advancedRebrews, 'Balance');
      let AvgFlavour = calculateAdvancedAvg(advancedRebrews, 'Flavour');
      let AvgBody = calculateAdvancedAvg(advancedRebrews, 'Body');
      
      Coffees.update({_id: newRebrew.CoffeeId}, {$set: {AverageAroma: AvgAroma, AverageAcidity: AvgAcidity , AverageBalance: AvgBalance , AverageFlavour: AvgFlavour , AverageBody: AvgBody }});
    },
    'rebrews.removeById'(id){
      check( id, Match.OneOf( String, null, undefined ) );
      //Check owner and remove rebrew
      let brewOwner = Rebrews.findOne({_id: id}).Owner;
      if (brewOwner == Meteor.userId() ){
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
      
        //Recalculate Advanced Average Ratings
        advancedRebrews = Rebrews.find({CoffeeName: brew, Advanced: true}).fetch();
        let AvgAroma = calculateAdvancedAvg(advancedRebrews, 'Aroma');
        let AvgAcidity = calculateAdvancedAvg(advancedRebrews, 'Acidity');
        let AvgBalance = calculateAdvancedAvg(advancedRebrews, 'Balance');
        let AvgFlavour = calculateAdvancedAvg(advancedRebrews, 'Flavour');
        let AvgBody = calculateAdvancedAvg(advancedRebrews, 'Body');

        Coffees.update(Coffees.findOne({CoffeeName:brew})._id, {$set: {AverageAroma: AvgAroma, AverageAcidity: AvgAcidity, AverageBalance: AvgBalance, AverageFlavour: AvgFlavour, AverageBody: AvgBody }});
      } else {
        console.log("Rebrew Removal Error From: " + Meteor.user().username);
      }
    },
    'rebrews.updateRebrew'(rebrew){
      console.log(rebrew);
      //Check owner and update rebrew
      if (Rebrews.findOne({_id: rebrew._id}).Owner == Meteor.userId() ) {
        let rebrewUpdate = {};
        rebrewUpdate._id = rebrew._id;
        rebrewUpdate.CoffeeId = rebrew.CoffeeId;
        rebrewUpdate.Title = rebrew.Title;
        rebrewUpdate.Rebrew = rebrew.Rebrew;
        rebrewUpdate.Advanced = rebrew.Advanced;
        rebrewUpdate.Aroma = rebrew.Aroma;
        rebrewUpdate.Body = rebrew.Body;
        rebrewUpdate.Acidity = rebrew.Acidity;
        rebrewUpdate.Flavour = rebrew.Flavour;
        rebrewUpdate.Balance = rebrew.Balance;
      
        if(rebrewUpdate.Advanced == 'true' || rebrewUpdate.Advanced == true){
          rebrewUpdate.Rating = parseFloat(sumAdvancedRebrew(rebrew));
        }else{
          if(rebrew.Rating == '') {
            rebrewUpdate.Rating = 0;
          } else {
            rebrewUpdate.Rating = Number(rebrew.Rating);
          }
        }
        try{
            Rebrews.update(rebrewUpdate._id, {$set: {Title: rebrewUpdate.Title, Rebrew: rebrewUpdate.Rebrew, Rating: rebrewUpdate.Rating }});
        }
        catch(e){
        }
        if(rebrewUpdate.Advanced){
          try{
            Rebrews.update(rebrewUpdate._id, {$set: {Aroma: rebrewUpdate.Aroma, Body: rebrewUpdate.Body, Acidity: rebrewUpdate.Acidity, Flavour: rebrewUpdate.Flavour, Balance: rebrewUpdate.Balance }});
          }
          catch(e){
          }
        }

        //Recalculate Average Rating
        let advancedRebrews = Rebrews.find({CoffeeId: rebrewUpdate.CoffeeId, Advanced: true}).fetch();
        let simpleRebrews = Rebrews.find({CoffeeId: rebrewUpdate.CoffeeId, Advanced: false}).fetch();

        let average = calculateCoffeeRating(simpleRebrews, advancedRebrews);

        Coffees.update({_id: rebrewUpdate.CoffeeId}, {$set: {AverageRating: average}});

        //Recalculate Advanced Average Ratings
        advancedRebrews = Rebrews.find({CoffeeId: rebrewUpdate.CoffeeId, Advanced: true}).fetch();
        if(advancedRebrews.length == 0){
          return;
        }
        let AvgAroma = calculateAdvancedAvg(advancedRebrews, 'Aroma');
        let AvgAcidity = calculateAdvancedAvg(advancedRebrews, 'Acidity');
        let AvgBalance = calculateAdvancedAvg(advancedRebrews, 'Balance');
        let AvgFlavour = calculateAdvancedAvg(advancedRebrews, 'Flavour');
        let AvgBody = calculateAdvancedAvg(advancedRebrews, 'Body');

        Coffees.update({_id: rebrewUpdate.CoffeeId}, {$set: {AverageAroma: AvgAroma, AverageAcidity: AvgAcidity, AverageBalance: AvgBalance, AverageFlavour: AvgFlavour, AverageBody: AvgBody }});
      
      } else {
        console.log("Rebrew Edit Error From: " + Meteor.user().username);
      }
    }
  });
}

function calculateCoffeeRating(allSimple, allAdvanced){
  let simpleRatings = _.pluck(allSimple, "Rating");
  let advancedRatings = allAdvanced.map((v,i) => {
    return sumAdvancedRebrew(v);
  });
  let sum = 0;
  
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

function calculateAdvancedAvg(allAdvanced, Attribute){
  let Ratings = _.pluck(allAdvanced, Attribute);
  let sum = 0;
  if(Ratings.length > 0){
    sum += Ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
  }
  if(Ratings.length < 1){
    throw "Something in your database is really messed up, sir!"
  }
  
    let average = ((sum) / (Ratings.length)).toFixed(1);
    return average;
}