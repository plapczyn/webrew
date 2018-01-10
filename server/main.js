import { Meteor } from 'meteor/meteor';
import {Check} from 'meteor/check';
import {Rebrews} from '../imports/api/collections/coffees.js';
import {BrewFiles} from '../imports/api/collections/coffees.js';

Meteor.startup(() => {
  // code to run on server at startup

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service: "facebook",
        // Development
        //appId: "422461951458041",
        //secret: "55f64372f1df13e4a6d6cd8d38509405"      
        // Live
        appId: "1358512727565112",
        secret: "e1b213a03536da9d5eabad0d85245e45"    
    });
    ServiceConfiguration.configurations.remove({
        service: "google"
    });
    ServiceConfiguration.configurations.insert({
        service: "google",
        // Development / Live
        clientId: "688220154422-349o412st98ok5bfesjm3vhqahgsinno.apps.googleusercontent.com",
        secret: "iuOGGYkxIkIBh40Odn3PU9zE"
    });

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
        console.log("Error inserting BrewFile during onCreateUser");
        console.log(user);
        console.log(brewfile);
    }
    
    return user;
});

Accounts.onLogin(function () {
    FlowRouter.go("/");
});