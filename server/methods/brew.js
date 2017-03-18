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
      Coffees.remove(id);
      Rebrews.remove({brewid: id});
      Favorites.remove({brewid: id});
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
      if(Coffees.findOne(coffee.OnlyCoffeeName())){
        if(Coffees.findOne(coffee.OnlyCoffeeName())._id == coffee.Only_id()){
          //Update Coffee-no name update
          Coffees.update(coffee.Only_id(), {$set: coffee.OnlyCoffeeRoast()});
          Coffees.update(coffee.Only_id(), {$set: coffee.OnlyImageUrl()});
          Coffees.update(coffee.Only_id(), {$set: coffee.OnlyCoffeeDescription()});
          return;
        }else {
          throw "Duplicate";
        }
      }else {
        //Update Coffee-name update
        Coffees.update(coffee.Only_id(), {$set: coffee.OnlyCoffeeName()});
        Coffees.update(coffee.Only_id(), {$set: coffee.OnlyCoffeeRoast()});
        Coffees.update(coffee.Only_id(), {$set: coffee.OnlyImageUrl()});
        Coffees.update(coffee.Only_id(), {$set: coffee.OnlyCoffeeDescription()});
        //Update reBrews
        let rebrew = new Rebrew({CoffeeId: coffee.Only_id(), CoffeeName: coffee.OnlyCoffeeName()});
        Rebrews.update(rebrew.OnlyCoffeeId(), {$set: rebrew.OnlyCoffeeName()},{multi: true});
        return;
      }
    }
  });
}
