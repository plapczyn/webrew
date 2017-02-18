import {Coffees } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';

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

  Meteor.publish('coffees.myCoffees', (user) => {
    return Coffees.find({username: user});
  });

  Meteor.publish('coffees.favorites', (user) => {
    let favorites = Favorites.find({user: user});
    let coffeeList = [];
    favorites.forEach((e) => {
      coffeeList.push({name: e.name});
    });

    let query = {
      $or: coffeeList
    }

    return Coffees.find(query);
  });

  Meteor.publish('brew', (brewName) => {
    return Coffees.find({name: brewName});
  })
}
