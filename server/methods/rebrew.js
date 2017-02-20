import { Rebrews } from '../../imports/api/collections/coffees.js';
import { Coffees } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
    Meteor.methods({
    ///favorite structure:
    ///{user: String, name: String}
    'rebrews.add'(rebrew){
      let rebrewInsert = {};

      rebrewInsert.brew = rebrew.brew;
      rebrewInsert.rebrew = rebrew.rebrew.trim();
      rebrewInsert.rating = rebrew.rating;
      rebrewInsert.title = rebrew.title.trim();
      rebrewInsert.reviewdate = new Date();
      rebrewInsert.owner = Meteor.userId();
      rebrewInsert.user = Meteor.user().username;
      
      Rebrews.insert(rebrewInsert);

      //Recalculate Average Rating
      let allreviews = Rebrews.find({brew: rebrewInsert.brew}).fetch();
      let ratings = _.pluck(allreviews, "rating");
      let sum = ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
      let average = (sum / ratings.length).toFixed(1);
      Coffees.update(Coffees.findOne({name:rebrewInsert.brew})._id, {$set: {averageRating: average}});
    },
    'rebrews.removeById'(id){
        check( id, Match.OneOf( String, null, undefined ) );
        let brew = Rebrews.findOne({_id: id}).brew;
        Rebrews.remove(id);
        
        //Recalculate Average Rating
        let reviewcount = Rebrews.find({brew: brew}).count();
        if (reviewcount > 0 ) {
          let allreviews = Rebrews.find({brew: brew}).fetch();
          let ratings = _.pluck(allreviews, "rating");
          let sum = ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
          let average = (sum / ratings.length).toFixed(1);
          Coffees.update(Coffees.findOne({name:brew})._id, {$set: {averageRating: average}});
        } else {
          Coffees.update(Coffees.findOne({name:brew})._id, {$set: {averageRating: reviewcount}});
        }
    },
    'rebrews.updateRebrew'(rebrew){
        let rebrewUpdate = {};
        rebrewUpdate.id = rebrew.id;
        rebrewUpdate.title = rebrew.title;
        rebrewUpdate.rebrew = rebrew.rebrew;
        rebrewUpdate.rating = rebrew.rating;

        try{
            Rebrews.update({_id: rebrewUpdate.id}, {$set: {title: rebrewUpdate.title}});
        }
        catch(e){
        }

        try{
            Rebrews.update({_id: rebrewUpdate.id}, {$set: {rebrew: rebrewUpdate.rebrew}});
        }
        catch(e){
        }
        try{
            Rebrews.update({_id: rebrewUpdate.id}, {$set: {rating: rebrewUpdate.rating}});
        }
        catch(e){
        }

        //Recalculate Average Rating
        let brew = Rebrews.findOne({_id: rebrewUpdate.id}).brew;
        let allreviews = Rebrews.find({brew: brew}).fetch();
        let ratings = _.pluck(allreviews, "rating");
        let sum = ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
        let average = (sum / ratings.length).toFixed(1);
        Coffees.update(Coffees.findOne({name:brew})._id, {$set: {averageRating: average}});
    }
  });
}


