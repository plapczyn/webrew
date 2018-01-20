import { Coffees } from '../../imports/api/collections/coffees.js';
import { Rebrews } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';

import { Coffee } from '../../lib/DatabaseModels.js';
import { Rebrew } from '../../lib/DatabaseModels.js';
import { Favorite } from '../../lib/DatabaseModels.js';

import fs from 'fs';

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

      //set variables
      let fs = require('fs');
      let path = process.env['METEOR_SHELL_DIR'] + '/../../../public/img/coffees/';
      
      //Find and delete existing by coffeeid
      fs.readdir( path, function( err, files ) {
        if (err) {
          console.log(err);
        } else {
          files.forEach ( function(file, index) {
            //if coffeeid in filename, and is not the uploadfile, delete
            if (file.indexOf(id) != -1) {
              fs.unlink(path + file, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('deleted:' + file);
                }
              });
            }
          });
        }
      });
    },

    'coffees.add'(brew){
      let createdAt = new Date();
      let coffeeOwner = Meteor.userId();
      let username = Meteor.user().username;
      let newbrew = Object.assign({},brew,{createdAt: createdAt, coffeeOwner: coffeeOwner, username: username })

      let coffee = new Coffee(newbrew);
      if(!Coffees.findOne(coffee.OnlyCoffeeName())){
        Coffees.insert(coffee.Get());
        return Coffees.findOne(coffee.OnlyCoffeeName())._id;
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
    },
    'coffees.upload'(coffeeid, fileinfo, filedata) {  
      //get user info based on current logged in user
      let coffeeOwner = Coffees.findOne({_id: coffeeid}).CoffeeOwner; 
      if (coffeeOwner != Meteor.userId()) {
        return;
      }
      
      //set variables
      let fs = require('fs');
      let path = process.env['METEOR_SHELL_DIR'] + '/../../../public/img/coffees/';
      let url = "/img/coffees/" + coffeeid + fileinfo;
      
      //Find and delete existing by coffeeid
      fs.readdir( path, function( err, files ) {
        if (err) {
          console.log(err);
        } else {
          files.forEach ( function(file, index) {
            //if coffeeid in filename, and is not the uploadfile, delete
            if (file.indexOf(coffeeid) != -1 && file != coffeeid + fileinfo) {
              fs.unlink(path + file, function (err) {
                if (err) {
                  console.log(err);
                } else {
                  console.log('deleted:' + file);
                }
              });
            }
          });
        }
      });

      //add path to file name and write 
      console.log("writing:" + coffeeid + fileinfo);
      fs.writeFile(path + coffeeid + fileinfo, filedata, {encoding: 'binary'}, Meteor.bindEnvironment((err) => {
        if(err) {
          return console.log(err);
        } else {
          Coffees.update({ _id: coffeeid}, {$set: {ImageUrl: url }});
        }
      }));
      return url;
    }
  });      
}
