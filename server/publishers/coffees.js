import { Coffees } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';
import { Brands } from '../../imports/api/collections/coffees.js';
import { Favorite } from '../../lib/DatabaseModels.js';
import { Coffee } from '../../lib/DatabaseModels.js';
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('coffeeSearch', function (searchText, searchBrand, searchRating, searchRoast) {
    check(searchText, Match.OneOf(String, null, undefined));
    check(searchBrand, Match.OneOf([String], null, undefined ));
    check(searchRating, Match.OneOf(String, null, undefined));
    check(searchRoast, Match.OneOf([String], null, undefined));

    let query = {};
    let projection = {};
    projection.limit = 100;

    if (searchText || searchBrand || searchRating || searchRoast) {
      let regex = new RegExp(searchText, 'i');
      let hasAvgRating = !(searchRating == "0");
      let avgRatingSubquery = [{ AverageRating: { $gte: searchRating } }];
      if (!hasAvgRating) {
        avgRatingSubquery.push({ AverageRating: { $exists: hasAvgRating } });
      }
      let brandSubquery = [];
      if (searchBrand[0] == "All") {
        brandSubquery.push({Brand: {$exists: true}}, {Brand: {$exists: false}});
      } else {
        brandSubquery.push({"Brand.Name": {$in: searchBrand }});
      }    
      query = {
        $and: [
          { $or: [{ "Brand.Name": { $regex: regex } }, { CoffeeName: { $regex: regex } }, { CoffeeRoast: { $regex: regex } }, { CoffeeDescription: { $regex: regex } }] },
          { $or: [{ CoffeeRoast: { $in: searchRoast } }] },
          { $or: avgRatingSubquery },
          { $or: brandSubquery }
        ]
      };
      return Coffees.find(query, projection);
    } else {
      return Coffees.find({}, projection);
    }
  });

  Meteor.publish('webrewHome', function () {
    return Coffees.find({}, {sort: { CreatedAt: -1 }, limit: 100 });
  });

  Meteor.publish('coffees.myCoffees', (user) => {
    let coffee = new Coffee({ username: user });
    return Coffees.find(coffee.Username(), { sort: { CreatedAt: -1 } });
  });

  Meteor.publish('coffees.mebrew', (user) => {
    // Gather favorites list
    let favorite = new Favorite(user);
    let favorites = Favorites.find(favorite.OnlyUsername());
    let coffeeList = [];

    let favoriteRegex = new Coffee({ Username: user })

    coffeeList.push(
      favoriteRegex.Get()
    );

    let query = {
      $or: coffeeList
    }
    return Coffees.find(query, { sort: { CreatedAt: -1 } });
  });

  Meteor.publish('brew', (brewName) => {
    return Coffees.find({ CoffeeName: brewName });
  });
  
  Meteor.publish('brands', function(id) {
    if (id) {
      return Brands.find({ _id: id }, { _id: 1, Name: 1});
    } else {
      return Brands.find({},{ _id: 1, Name: 1});
    }
  });
}
