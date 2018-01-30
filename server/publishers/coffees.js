import { Coffees } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';
import { Roasters } from '../../imports/api/collections/coffees.js';
import { Favorite } from '../../lib/DatabaseModels.js';
import { Coffee } from '../../lib/DatabaseModels.js';
if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('coffeeSearch', function (searchText, searchCompany, searchRating, searchRoast) {
    check(searchText, Match.OneOf(String, null, undefined));
    check(searchCompany, Match.OneOf([String], null, undefined ));
    check(searchRating, Match.OneOf(String, null, undefined));
    check(searchRoast, Match.OneOf([String], null, undefined));

    let query = {};
    let projection = {};
    projection.limit = 100;

    if (searchText || searchCompany || searchRating || searchRoast) {
      let regex = new RegExp(searchText, 'i');
      let hasAvgRating = !(searchRating == "0");
      let avgRatingSubquery = [{ AverageRating: { $gte: searchRating } }];
      if (!hasAvgRating) {
        avgRatingSubquery.push({ AverageRating: { $exists: hasAvgRating } });
      }
      let companySubquery = [];
      if (searchCompany[0] == "All") {
        companySubquery.push({Roaster: {$exists: true}}, {Roaster: {$exists: false}});
      } else {
        companySubquery.push({"Roaster.Name": {$in: searchCompany }});
      }    
      query = {
        $and: [
          { $or: [{ "Roaster.Name": { $regex: regex } }, { CoffeeName: { $regex: regex } }, { CoffeeRoast: { $regex: regex } }, { CoffeeDescription: { $regex: regex } }] },
          { $or: [{ CoffeeRoast: { $in: searchRoast } }] },
          { $or: avgRatingSubquery },
          { $or: companySubquery }
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
  
  Meteor.publish('roasters', function(id) {
    if (id) {
      return Roasters.find({ _id: id }, { _id: 1, Name: 1});
    } else {
      return Roasters.find({},{ _id: 1, Name: 1});
    }
  });
}
