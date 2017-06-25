import { Meteor } from 'meteor/meteor';
import {Check} from 'meteor/check';
import {Rebrews} from '../imports/api/collections/coffees.js';

Meteor.startup(() => {
  // code to run on server at startup

    ServiceConfiguration.configurations.remove({
        service: "facebook"
    });
    ServiceConfiguration.configurations.insert({
        service: "facebook",
        // Development
        appId: "422461951458041",
        secret: "55f64372f1df13e4a6d6cd8d38509405"      
        // Live
        //appId: "1358512727565112",
        //secret: "e1b213a03536da9d5eabad0d85245e45"    
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
    if (user.services.facebook) {
        //FacebookUser
        user.username = user.services.facebook.name;
        user.emails = user.services.facebook.email;
        return user;
    } else if (user.services.google) {
        //GoogleUser
        user.username = user.services.google.name;
        user.emails = user.services.google.email;
        return user;
    } else { 
        //StandardUser
        return user;
    }
});