import { BrewFiles } from '../../imports/api/collections/coffees.js';
import { Brewfile } from '../../lib/DatabaseModels.js';

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
        // console.log("Update Profile Error From: " + Meteor.user().username);
      }
    },
    'brewfile.user'(){
      if (Meteor.user()) {
        return true;
      } else { 
        return false;
      }
    },
    'brewfile.upload'(brewfileid, fileinfo, filedata) {  
      //get user info based on current logged in user
      brewfileid = BrewFiles.findOne({Username: Meteor.user().username})._id;

      //set variables
      let fs = require('fs');
      let path = process.env['METEOR_SHELL_DIR'] + '/../../../public/img/profiles/';
      let url = "/img/profiles/" + brewfileid + fileinfo;
      
      //Find and delete existing by brewfileid
      fs.readdir( path, function( err, files ) {
        if (err) {
          // console.log(err);
        } else {
          files.forEach ( function(file, index) {
            //if brewfileid in filename, and is not the uploadfile, delete
            if (file.indexOf(brewfileid) != -1 && file != brewfileid + fileinfo) {
              fs.unlink(path + file, function (err) {
                if (err) {
                  // console.log(err);
                } else {
                 // console.log('deleted:' + file);
                }
              });
            }
          });
        }
      });
      
      //add path to file name and write 
      //console.log("writing:" + brewfileid + fileinfo);
      fs.writeFile(path + brewfileid + fileinfo, filedata, {encoding: 'binary'}, Meteor.bindEnvironment((err) => {
        if(err) {
          //console.log(err);
          return;
        } else {
          BrewFiles.update({_id: brewfileid}, {$set: {ImageUrl: url}});
        }    
      }));
      return url;
    }
  });
}
