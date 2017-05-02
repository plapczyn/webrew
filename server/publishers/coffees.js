import {Coffees } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';
import { Favorite } from '../../lib/DatabaseModels.js';
import { Coffee } from '../../lib/DatabaseModels.js';
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
          { CoffeeName: {$regex: regex} },
          { CoffeeRoast: {$regex: regex}}
        ]
      };

      projection.limit = 98;
      return Coffees.find(query,{ sort:{ CreatedAt: -1 }});
    }
    return Coffees.find({},{ sort:{ CreatedAt: -1 }});
  });

  Meteor.publish('coffees.myCoffees', (user) => {
    let coffee = new Coffee({username: user});
    return Coffees.find(coffee.Username(),{ sort:{ CreatedAt: -1 }});
  });

  Meteor.publish('coffees.mebrew', (user,search) => {
    // Gather favorites list
    let favorite = new Favorite(user);
    let favorites = Favorites.find(favorite.OnlyUsername());
    let coffeeList = [];

    //// Setup if currently Searching
    let isSearching = false;
    if(!!search){
      isSearching = true;
    }
    let regex = new RegExp( search, 'i' );

    favorites.forEach((e) => {
      let name = (!!isSearching)? {$regex: regex} : Coffees.findOne({_id: e.CoffeeId}).CoffeeName;
      coffeeList.push({CoffeeName: name});
    });

    let favoriteRegex = new Coffee({Username: user, CoffeeName: {$regex: regex}})

    coffeeList.push(
      favoriteRegex.Get()
    );

    let query = {
      $or: coffeeList
    }
    return Coffees.find(query,{ sort:{ CreatedAt: -1 }});
  });

  Meteor.publish('brew', (brewName) => {
    let coffee = new Coffee({CoffeeName: brewName})
    return Coffees.find(coffee.Get(),{ sort:{ CreatedAt: -1 }});
  })
}
