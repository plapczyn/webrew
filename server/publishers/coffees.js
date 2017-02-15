import {Coffees } from '../../imports/api/collections/coffees.js';

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('coffeeSearch', function( search ) {
    check( search, Match.OneOf( String, null, undefined ) );
    let query      = {},
    projection = { limit: 8, sort: { title: -1 } };

    if ( search ) {
      let regex = new RegExp( search, 'i' );
      query = {
        $or: [
          { name: {$regex: regex} },
          { roast: {$regex: regex}}
        ]
      };

      projection.limit = 98;
      return Coffees.find(query);
    }
    return Coffees.find();
  });

  Meteor.publish('coffeesForBrewfile', (user) => {
    // console.log(Coffees.find({username:user}));
    // console.log(Coffees.findOne({username:user}));
    return Coffees.find({username: user});
  });

  Meteor.publish('brew', (brewName) => {
    return Coffees.find({name: brewName});
  })
}
