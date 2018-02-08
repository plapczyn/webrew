import { Meteor } from 'meteor/meteor';
import {Check} from 'meteor/check';
import {Rebrews} from '../imports/api/collections/coffees.js';
import {BrewFiles} from '../imports/api/collections/coffees.js';
import {Config} from '../imports/api/collections/coffees.js';

Meteor.startup(() => {
  // code to run on server at startup
    // var DBConfig;
    // DBConfig = Config.findOne({ "service": "facebook","env":"Live" });

    // ServiceConfiguration.configurations.remove({
    //     service: "facebook"
    // });
    // ServiceConfiguration.configurations.insert({
    //     service: "facebook",
    //     appId: DBConfig.appId,
    //     secret: DBConfig.secret
    // });

    // DBConfig = Config.findOne({ "service": "google","env":"Live" });
    
    // ServiceConfiguration.configurations.remove({
    //     service: "google"
    // });
    // ServiceConfiguration.configurations.insert({
    //     service: "google",
    //     clientId: DBConfig.clientId,
    //     secret: DBConfig.secret
    // });
});

Accounts.onCreateUser(function (options, user) {
    let brewfile = {};
    brewfile.email = "";
    brewfile.imageurl = "";
    
    if (user.services.facebook) {
        //FacebookUser
        user.username = user.services.facebook.name;
        brewfile.email = user.services.facebook.email;
        brewfile.imageurl = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
    } else if (user.services.google) {
        //GoogleUser
        user.username = user.services.google.name;
        brewfile.email = user.services.google.email;
        brewfile.imageurl = user.services.google.picture;
    } else { 
        //StandardUser
    }
    
    //create BrewFile profile
    try{
        BrewFiles.insert({ Username: user.username, ImageUrl: brewfile.imageurl, Email: brewfile.email });
    }
    catch(e){
        //console.log("Error inserting BrewFile during onCreateUser");
        //console.log(user);
        //console.log(brewfile);
    }
    
    return user;
});

Accounts.onLogin(function () {
    FlowRouter.go("/");
});