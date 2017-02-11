import { Meteor } from 'meteor/meteor';
import {Coffees } from '../imports/api/collections/coffees.js'
import {Check} from 'meteor/check'
Meteor.startup(() => {
  // code to run on server at startup
});


if (Meteor.isServer) {
  console.log("ASDASD");
  // This code only runs on the server
  Meteor.publish('coffees', function( search ) {
      check( search, Match.OneOf( String, null, undefined ) );
  console.log(search);
    let query      = {},
        projection = { limit: 9, sort: { title: 0 } };

    if ( search ) {
      let regex = new RegExp( search, 'i' );

      query = {
        $or: [
          { name: regex },
        ]
      };

      projection.limit = 99;

    return Coffees.find({name: {$regex: new RegExp(search, 'i')}});
    }

  return Coffees.find();
  });

}
