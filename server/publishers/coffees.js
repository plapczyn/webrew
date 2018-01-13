import { Coffees } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';
import { Favorite } from '../../lib/DatabaseModels.js';
import { Coffee } from '../../lib/DatabaseModels.js';
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('coffeeSearch', function( searchText, searchRating, searchRoast ) {
    check( searchText, Match.OneOf( String, null, undefined ) );
    check( searchRating, Match.OneOf( String, null, undefined ) );
    check( searchRoast, Match.OneOf( String, null, undefined ) );

    searchRoast = searchRoast.split(",");
    let query = {};
    let projection = {}; 
    projection.limit = 100; 

    if ( searchText || searchRating || searchRoast ) {
      let regex = new RegExp( searchText, 'i' );
      let hasAvgRating = !(searchRating == "0");
      let avgRatingSubquery = [{AverageRating: {$gte: searchRating} }];
      if (!hasAvgRating){
        avgRatingSubquery.push({AverageRating: {$exists: hasAvgRating}});
      }
      query = {
        $and: [
          { $or: [ {CoffeeCompany: {$regex: regex} }, { CoffeeName: {$regex: regex} }, { CoffeeRoast: {$regex: regex}}, { CoffeeDescription: {$regex: regex}} ]},
          { $or: [ {CoffeeRoast: {$in: searchRoast} } ] },
          { $or: avgRatingSubquery }
        ]
      };
      return Coffees.find(query, projection);
    } else {
      return Coffees.find({}, projection);
    }
  });

  Meteor.publish('webrewHome', function() {
    return Coffees.find({},{ sort: { CreatedAt: -1 }, limit: 100});
  });

  Meteor.publish('coffees.myCoffees', (user) => {
    let coffee = new Coffee({username: user});
    return Coffees.find(coffee.Username(),{ sort:{ CreatedAt: -1 }});
  });

  Meteor.publish('coffees.mebrew', (user) => {
    // Gather favorites list
    let favorite = new Favorite(user);
    let favorites = Favorites.find(favorite.OnlyUsername());
    let coffeeList = [];

    let favoriteRegex = new Coffee({Username: user})

    coffeeList.push(
      favoriteRegex.Get()
    );

    let query = {
      $or: coffeeList
    }
    return Coffees.find(query,{ sort:{ CreatedAt: -1 }});
  });

  Meteor.publish('brew', (brewName) => {
    return Coffees.find({CoffeeName: brewName});
  })
}
