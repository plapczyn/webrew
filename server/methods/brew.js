import { Coffees } from '../../imports/api/collections/coffees.js';
import { Rebrews } from '../../imports/api/collections/coffees.js';
import { Favorites } from '../../imports/api/collections/coffees.js';
import { Config } from '../../imports/api/collections/coffees.js';
import { Brands } from '../../imports/api/collections/coffees.js';
import { Coffee } from '../../lib/DatabaseModels.js';
import { Rebrew } from '../../lib/DatabaseModels.js';
import { Favorite } from '../../lib/DatabaseModels.js';
import WebrewInputDbMethods from '../../lib/WebrewInputMethods.js';

import fs from 'fs';
import { HTTP } from 'meteor/http'

if (Meteor.isServer) {
  Meteor.methods({
    'coffees.removeById'(id) {
      check(id, Match.OneOf(String, null, undefined));
      //Check owner and remove from coffees, rebrews, and favorites
      let coffeeOwner = Coffees.findOne({ _id: id }).CoffeeOwner;
      if (coffeeOwner == Meteor.userId()) {
        Coffees.remove(id);
        Rebrews.remove({ CoffeeId: id });
        Favorites.remove({ CoffeeId: id });
      } else {
        console.log("Coffee Removal Error From: " + Meteor.user().username);
      }

      //set variables
      let fs = require('fs');
      let path = process.env['METEOR_SHELL_DIR'] + '/../../../public/img/coffees/';

      //Find and delete existing by coffeeid
      fs.readdir(path, function (err, files) {
        if (err) {
          console.log(err);
        } else {
          files.forEach(function (file, index) {
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

    'coffees.add'(brew) {
      let newbrew = {
        CreatedAt: new Date(),
        CoffeeOwner: Meteor.userId(),
        Username: Meteor.user().username,
        CoffeeName: brew.CoffeeName,
        CoffeeRoast: brew.CoffeeRoast,
        ImageUrl: brew.ImageUrl,
        CoffeeDescription: brew.CoffeeDescription
      };

      if (!Coffees.findOne({CoffeeName: newbrew.CoffeeName})) {
        Coffees.insert(newbrew);
        let id = Coffees.findOne({CoffeeName: newbrew.CoffeeName})._id;

        WebrewInputDbMethods.UpdateSource({
          key: brew.CoffeeBrandId,
          collection: Brands,
          value: brew.CoffeeBrandValue,
          valueProperty: "Name",
          name: "Brand",
          collectionUpdates: [{
            id: id,
            collection: Coffees
          }]
        });

        return id;
      }
      else{
        throw new Meteor.Error('coffees.add', "Coffee Already Exists")
      }
    },
    'coffees.edit'(brew) {
      //Check owner and edit coffee
      var id = brew._id

      let coffeeOwner = Coffees.findOne({ _id: brew._id }).CoffeeOwner;
      if (coffeeOwner == Meteor.userId()) {

        WebrewInputDbMethods.UpdateSource({
          key: brew.BrandId,
          collection: Brands,
          value: brew.BrandName,
          valueProperty: "Name",
          name: "Brand",
          collectionUpdates: [{
            id: id,
            collection: Coffees
          }]
        });

        if (Coffees.findOne({ CoffeeName: brew.CoffeeName })) {

          if (Coffees.findOne({ CoffeeName: brew.CoffeeName })._id == brew._id) {
            //Update Coffee-no name update
            Coffees.update(id, { $set: { CoffeeRoast: brew.CoffeeRoast } });
            Coffees.update(id, { $set: { ImageUrl: brew.ImageUrl } });
            Coffees.update(id, { $set: { CoffeeDescription: brew.CoffeeDescription } });
            return;
          }
          else {
            throw new Meteor.Error('coffees.edit', "Coffee Already Exists")
          }
        } else {
          //Update Coffee-name update

          Coffees.update(id, { $set: { CoffeeName: brew.CoffeeName } });
          Coffees.update(id, { $set: { CoffeeRoast: brew.CoffeeRoast } });
          Coffees.update(id, { $set: { ImageUrl: brew.ImageUrl } });
          Coffees.update(id, { $set: { CoffeeDescription: brew.CoffeeDescription } });
          //Update reBrews
          Rebrews.update(brew._id, { $set: { CoffeeName: brew.CoffeeName } }, { multi: true });
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
      let coffeeOwner = Coffees.findOne({ _id: coffeeid }).CoffeeOwner;
      if (coffeeOwner != Meteor.userId()) {
        return;
      }

      //get token
      var imgurConfig = Config.findOne({ "service": "imgur" });
      var tokenDetails = {
        "refresh_token": imgurConfig.refresh_token,
        "client_id": imgurConfig.client_id,
        "client_secret": imgurConfig.client_secret
      };
      var response;
      var url;
      var json;
      response = HTTP.call('POST', 'https://api.imgur.com/oauth2/token', {
        headers: { "Content-type": "application/json" },
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
        console.log(response);
      }

      if (tokenDetails.access_token && tokenDetails.refresh_token) {
        //log refresh token in db
        Config.update({ "service": "imgur" }, { $set: { "refresh_token": tokenDetails.refresh_token } });

        response = HTTP.call('POST', 'https://api.imgur.com/3/image', {
          headers: { "Authorization": "Bearer " + tokenDetails.access_token },
          data: { "name": fileinfo, "album": "uMuWV", "type": "base64", "image": filedata }
        });
        if (response.statusCode == 200) {
          //image upload success
          if (response.data.data.link) {
            Coffees.update({ _id: coffeeid }, { $set: { "ImageUrl": response.data.data.link } });
          }
        } else {
          //image upload failure
          console.log("image upload failure");
          console.log(response);
        }
      }
    }
  });
}