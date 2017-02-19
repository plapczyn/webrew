import { Rebrews } from '../../imports/api/collections/coffees.js';
import { Coffees } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    ///favorite structure:
    ///{user: String, name: String}
    'rebrews.add'(rebrew){
      Rebrews.insert(rebrew);
      let allreviews = Rebrews.find({brew:rebrew.brew}).fetch();
      let ratings = _.pluck(allreviews, "rating");
      let sum = ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
      let average = (sum / ratings.length).toFixed(1);
      Coffees.update(Coffees.findOne({name:rebrew.brew})._id, {$set: {averageRating: average}});
    }
  });
}
