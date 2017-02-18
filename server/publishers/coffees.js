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

  Meteor.publish('coffees.mebrew', (user,search) => {
    // Gather favorites list
    let favorites = Favorites.find({user: user});
    let coffeeList = [];

    //// Setup if currently Searching
    let isSearching = false;
    if(!!search){
      isSearching = true;
    }
    let regex = new RegExp( search, 'i' );

    favorites.forEach((e) => {
      let name = (isSearching)? {$regex: regex} : e;
      coffeeList.push({name: name});
    });

    coffeeList.push(
      {
        username: user,
        name: {$regex: regex}
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
