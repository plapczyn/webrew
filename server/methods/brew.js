import { Coffees } from '../../imports/api/collections/coffees.js';
import { Rebrews } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';
import { Config } from '../../imports/api/collections/coffees.js';
import { Roasters } from '../../imports/api/collections/coffees.js';
import { Coffee } from '../../lib/DatabaseModels.js';
import { Rebrew } from '../../lib/DatabaseModels.js';
import { Favorite } from '../../lib/DatabaseModels.js';

import fs from 'fs';
import { HTTP } from 'meteor/http'

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
      if(brew.coffeeCompanyId == "" && Roasters.find({Name: brew.coffeeCompanyValue}).fetch().length == 0){
        Roasters.insert({Name: brew.coffeeCompanyValue}, (err, id) => {
          let coffee = new Coffee(newbrew);
          let newCoffee = coffee.Get();
          newCoffee.Roaster = Roasters.findOne(id);
    
          if(!Coffees.findOne(coffee.OnlyCoffeeName())){
            Coffees.insert(newCoffee);
            return Coffees.findOne(coffee.OnlyCoffeeName())._id;
          }
        });
      }
      else
      {
        let coffee = new Coffee(newbrew);
        let newCoffee = coffee.Get();
        newCoffee.Roaster = Roasters.findOne(brew.coffeeCompanyId);
  
        if(!Coffees.findOne(coffee.OnlyCoffeeName())){
          Coffees.insert(newCoffee);
          return Coffees.findOne(coffee.OnlyCoffeeName())._id;
        }
      }

      // let coffee = new Coffee(newbrew);
      // let newCoffee = coffee.Get();
      // newCoffee.RoasterId = brew.coffeeCompanyId;

      // if(!Coffees.findOne(coffee.OnlyCoffeeName())){
      //   Coffees.insert(newCoffee);
      //   return Coffees.findOne(coffee.OnlyCoffeeName())._id;
      // }
      // throw "Brew Not Found";
    },
    'coffees.edit'(brew){
      var coffee = new Coffee(brew);
      coffee.coffeeCompanyId = brew.coffeeCompanyId;
      coffee.coffeeCompanyValue = brew.coffeeCompanyValue;
      console.log(coffee);
      //Check owner and edit coffee
      let coffeeOwner = Coffees.findOne({_id: coffee._id}).CoffeeOwner;
      if (coffeeOwner == Meteor.userId() ){
        var id = coffee.Only_id();
        //coffee company
        if (Roasters.find({Name: coffee.coffeeCompanyValue}).fetch().length == 0){
          console.log("insert roaster");
          Roasters.insert({Name: coffee.coffeeCompanyValue});
          coffee.Roaster = Roasters.findOne({Name: coffee.coffeeCompanyValue});
        } else {
          console.log("found roaster");
          coffee.Roaster = Roasters.findOne({Name: coffee.coffeeCompanyValue});
        }
        console.log(coffee);
        if(Coffees.findOne(coffee.OnlyCoffeeName())){
          if(Coffees.findOne(coffee.OnlyCoffeeName())._id == coffee.Only_id()._id){
            //Update Coffee-no name update
            Coffees.update(id, {$set: {Roaster: coffee.Roaster}});
            Coffees.update(id, {$set: coffee.OnlyCoffeeRoast()});
            Coffees.update(id, {$set: coffee.OnlyImageUrl()});
            Coffees.update(id, {$set: coffee.OnlyCoffeeDescription()});
            return;
          }
        }else {
          //Update Coffee-name update
          Coffees.update(id, {$set: coffee.OnlyCoffeeName()});
          Coffees.update(id, {$set: {Roaster: coffee.Roaster}});
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
    // 'coffees.upload'(coffeeid, fileinfo, filedata) {  
    //   //get user info based on current logged in user
    //   let coffeeOwner = Coffees.findOne({_id: coffeeid}).CoffeeOwner; 
    //   if (coffeeOwner != Meteor.userId()) {
    //     return;
    //   }
      
    //   //set variables
    //   let fs = require('fs');
    //   let path = process.env['METEOR_SHELL_DIR'] + '/../../../public/img/coffees/';
    //   let url = "/img/coffees/" + coffeeid + fileinfo;
      
    //   //Find and delete existing by coffeeid
    //   fs.readdir( path, function( err, files ) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       files.forEach ( function(file, index) {
    //         //if coffeeid in filename, and is not the uploadfile, delete
    //         if (file.indexOf(coffeeid) != -1 && file != coffeeid + fileinfo) {
    //           fs.unlink(path + file, function (err) {
    //             if (err) {
    //               console.log(err);
    //             } else {
    //               console.log('deleted:' + file);
    //             }
    //           });
    //         }
    //       });
    //     }
    //   });

    //   //add path to file name and write 
    //   console.log("writing:" + coffeeid + fileinfo);
    //   fs.writeFile(path + coffeeid + fileinfo, filedata, {encoding: 'binary'}, Meteor.bindEnvironment((err) => {
    //     if(err) {
    //       console.log(err);
    //     } else {
    //       Coffees.update({ _id: coffeeid}, {$set: {ImageUrl: url }});
    //     }
    //   }));
    //   return url;
    // },
    'coffees.uploadImgur'(coffeeid, fileinfo, filedata) {    
      //get user info based on current logged in user
      let coffeeOwner = Coffees.findOne({_id: coffeeid}).CoffeeOwner; 
      if (coffeeOwner != Meteor.userId()) {
        return;
      }

      //get token
      var imgurConfig = Config.findOne({"service":"imgur"}); 
      var tokenDetails = { "refresh_token": imgurConfig.refresh_token,
        "client_id": imgurConfig.client_id,
        "client_secret": imgurConfig.client_secret };
      var response;
      var url;
      var json;
      response = HTTP.call( 'POST', 'https://api.imgur.com/oauth2/token', {
        headers: {"Content-type": "application/json"},
        data: {
          "refresh_token": imgurConfig.refresh_token,
          "client_id": imgurConfig.client_id,
          "client_secret": imgurConfig.client_secret,
          "grant_type": "refresh_token"
        }
      });
      if (response.statusCode == 200) {
        //token request success
        tokenDetails.access_token = response.data.access_token;
        tokenDetails.refresh_token = response.data.refresh_token;
      } else {
        //token request failure
        console.log("token request failure");
        console.log( response );
      }
            
      if ( tokenDetails.access_token && tokenDetails.refresh_token ) {
        //log refresh token in db
        Config.update({"service":"imgur"}, {$set: {"refresh_token": tokenDetails.refresh_token }});

        response = HTTP.call( 'POST', 'https://api.imgur.com/3/image', {
          headers: {"Authorization": "Bearer " + tokenDetails.access_token},
          data: { "name": fileinfo, "album": "uMuWV", "type":"base64", "image": filedata }
        });
        if (response.statusCode == 200) {
          //image upload success
          if ( response.data.data.link ) {
            Coffees.update({_id: coffeeid}, {$set: {"ImageUrl": response.data.data.link }});
          } 
        } else {
          //image upload failure
          console.log("image upload failure");
          console.log( response );
        }
      }
    }
  });      
}