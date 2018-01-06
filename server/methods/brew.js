import { Coffees } from '../../imports/api/collections/coffees.js';
import { Rebrews } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';

import { Coffee } from '../../lib/DatabaseModels.js';
import { Rebrew } from '../../lib/DatabaseModels.js';
import { Favorite } from '../../lib/DatabaseModels.js';


if(Meteor.isServer){
  Meteor.methods({
    'coffees.removeById'(id){
      check( id, Match.OneOf( String, null, undefined ) );
      //Check owner and remove from coffees, rebrews, and favorites
      let coffeeOwner = Coffees.findOne({_id: id}).CoffeeOwner;
      if (coffeeOwner == Meteor.userId() ){
        Coffees.remove(id);
        Rebrews.remove({CoffeeId: id});
        Favorites.remove({CoffeeId: id});
      } else {
        console.log("Coffee Removal Error From: " + Meteor.user().username);
      }
    },

    'coffees.add'(brew){
      let createdAt = new Date();
      let coffeeOwner = Meteor.userId();
      let username = Meteor.user().username;
      let newbrew = Object.assign({},brew,{createdAt: createdAt, coffeeOwner: coffeeOwner, username: username })

      let coffee = new Coffee(newbrew);
      if(!Coffees.findOne(coffee.OnlyCoffeeName())){
        Coffees.insert(coffee.Get());
        return;
      }
      throw "Brew Not Found";
    },
    'coffees.edit'(brew){
      let coffee = new Coffee(brew);
      //Check owner and edit coffee
      let coffeeOwner = Coffees.findOne({_id: coffee._id}).CoffeeOwner;
      if (coffeeOwner == Meteor.userId() ){
        if(Coffees.findOne(coffee.OnlyCoffeeName())){
          if(Coffees.findOne(coffee.OnlyCoffeeName())._id == coffee.Only_id()._id){
            //Update Coffee-no name update
            var id = coffee.Only_id();
            Coffees.update(id, {$set: coffee.OnlyCoffeeCompany()});
            Coffees.update(id, {$set: coffee.OnlyCoffeeRoast()});
            Coffees.update(id, {$set: coffee.OnlyImageUrl()});
            Coffees.update(id, {$set: coffee.OnlyCoffeeDescription()});
            return;
          }
        }else {
          //Update Coffee-name update

          var id = coffee.Only_id();
          Coffees.update(id, {$set: coffee.OnlyCoffeeName()});
          Coffees.update(id, {$set: coffee.OnlyCoffeeCompany()});
          Coffees.update(id, {$set: coffee.OnlyCoffeeRoast()});
          Coffees.update(id, {$set: coffee.OnlyImageUrl()});
          Coffees.update(id, {$set: coffee.OnlyCoffeeDescription()});
          //Update reBrews
          let rebrew = new Rebrew({CoffeeId: coffee.Only_id(), CoffeeName: coffee.OnlyCoffeeName()});
          Rebrews.update(rebrew.OnlyCoffeeId(), {$set: rebrew.OnlyCoffeeName()},{multi: true});
          return;
        }
      } else {
        console.log("Coffee Edit Error From: " + Meteor.user().username);
      }
    }
  });
}
