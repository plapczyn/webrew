import { Meteor } from 'meteor/meteor';
import {Coffees } from '../imports/api/collections/coffees.js'
import {Check} from 'meteor/check'
import {Rebrews} from '../imports/api/collections/coffees.js'
Meteor.startup(() => {
  // code to run on server at startup
});


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('coffees', function( search ) {
    check( search, Match.OneOf( String, null, undefined ) );
    let query      = {},
    projection = { limit: 9, sort: { title: 0 } };

    if ( search ) {
      let regex = new RegExp( search, 'i' );
      query = {
        $or: [
          { name: {$regex: regex} },
          { roast: {$regex: regex}}
        ]
      };

      projection.limit = 99;

      return Coffees.find(query);
    }

    return Coffees.find();
  });

  Meteor.methods({
  'reBrewCount'(brew){
    console.log(brew);
    console.log(Rebrews.find({brew: brew}).count())
    var count = Rebrews.find({brew: brew}).count();
    return count; 
  }
  });

}
