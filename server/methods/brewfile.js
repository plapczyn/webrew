import { BrewFiles } from '../../imports/api/collections/coffees.js';
import { Brewfile } from '../../lib/DatabaseModels.js';
import { Config } from '../../imports/api/collections/coffees.js';
import fs from 'fs';
import { HTTP } from 'meteor/http'

if(Meteor.isServer){
  Meteor.methods({
    'brewfile.updateProfile'(brewfile){
      let _brewfile = new Brewfile(brewfile);
      if (_brewfile.Username == Meteor.user().username ) {
        try{
          var id = BrewFiles.findOne(_brewfile.OnlyUsername())._id;
          BrewFiles.update({_id: id}, {$set: _brewfile.OnlyImageUrl()});
        }
        catch(e){
          BrewFiles.insert(_brewfile.Get());
        }
        try{
          var id = BrewFiles.findOne(_brewfile.OnlyUsername())._id;
          BrewFiles.update({_id: id}, {$set: _brewfile.OnlyTagline()});
        }
        catch(e){
          BrewFiles.insert(_brewfile.Get());
        }
        try{
          var id = BrewFiles.findOne(_brewfile.OnlyUsername())._id;
          BrewFiles.update({_id: id}, {$set: _brewfile.OnlyEmail()});
        }
        catch(e){
          BrewFiles.insert(_brewfile.Get());
        }
      } else {
        console.log("Update Profile Error From: " + Meteor.user().username);
      }
    },
    'brewfile.user'(){
      if (Meteor.user()) {
        return true;
      } else { 
        return false;
      }
    },
    // 'brewfile.upload'(brewfileid, fileinfo, filedata) {  
    //   //get user info based on current logged in user
    //   brewfileid = BrewFiles.findOne({Username: Meteor.user().username})._id;

    //   //set variables
    //   let fs = require('fs');
    //   let path = process.env['METEOR_SHELL_DIR'] + '/../../../public/img/profiles/';
    //   let url = "/img/profiles/" + brewfileid + fileinfo;
      
    //   //Find and delete existing by brewfileid
    //   fs.readdir( path, function( err, files ) {
    //     if (err) {
    //       console.log(err);
    //     } else {
    //       files.forEach ( function(file, index) {
    //         //if brewfileid in filename, and is not the uploadfile, delete
    //         if (file.indexOf(brewfileid) != -1 && file != brewfileid + fileinfo) {
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
    //   console.log("writing:" + brewfileid + fileinfo);
    //   fs.writeFile(path + brewfileid + fileinfo, filedata, {encoding: 'binary'}, Meteor.bindEnvironment((err) => {
    //     if(err) {
    //       console.log(err);
    //       return;
    //     } else {
    //       BrewFiles.update({_id: brewfileid}, {$set: {ImageUrl: url}});
    //     }    
    //   }));
    //   return url;
    // },
    'brewfile.uploadImgur'(brewfileid, fileinfo, filedata) {  
      //get user info based on current logged in user
      brewfileid = BrewFiles.findOne({Username: Meteor.user().username})._id;

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
          data: { "name": fileinfo, "album": "ycTas", "type":"base64", "image": filedata }
        });
        if (response.statusCode == 200) {
          //image upload success
          if ( response.data.data.link ) {
            BrewFiles.update({_id: brewfileid}, {$set: {"ImageUrl": response.data.data.link }});
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
