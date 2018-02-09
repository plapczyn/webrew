import { Meteor } from 'meteor/meteor';
import {Check} from 'meteor/check';
import {Rebrews} from '../imports/api/collections/coffees.js';
import {BrewFiles} from '../imports/api/collections/coffees.js';
import {Config} from '../imports/api/collections/coffees.js';
import fs from 'fs';

Meteor.startup(() => {
    //code to run on server at startup
    // serviceconfig.json contains all API clientids, secrets, and keys for services
    
    ServiceConfiguration.configurations.remove({ service: "facebook" });
    ServiceConfiguration.configurations.remove({ service: "google" });

    var DBConfig, FileConfig, filedata;

    DBConfig = Config.findOne({ "service": "facebook","env":"Live" }); 
    filedata = fs.readFileSync( __meteor_bootstrap__.serverDir.split(".meteor")[0] + "serviceconfig.json");
    FileConfig = JSON.parse(filedata);

    if (DBConfig) {
        ServiceConfiguration.configurations.insert({
            service: "facebook",
            appId: DBConfig.appId,
            secret: DBConfig.secret
        });
    } else if (FileConfig) {
        ServiceConfiguration.configurations.insert({
            service: "facebook",
            appId: FileConfig.service.facebook.env.Live.appId,
            secret: FileConfig.service.facebook.env.Live.secret
        });
        Config.insert({
            "service":"facebook",
            "env":"Live",
            "appId": FileConfig.service.facebook.env.Live.appId,
            "secret": FileConfig.service.facebook.env.Live.secret
        });
        Config.insert({
            "service":"facebook",
            "env":"Dev",
            "appId": FileConfig.service.facebook.env.Dev.appId,
            "secret": FileConfig.service.facebook.env.Dev.secret
        });            
    } else {
        console.log("Error setting up Facebook service, using default values");
        ServiceConfiguration.configurations.insert({
            service: "facebook",
            appId: "",
            secret: ""
        });
    }

    DBConfig = Config.findOne({ "service": "google","env":"Live" });

    if (DBConfig) {
        ServiceConfiguration.configurations.insert({
            service: "google",
            clientId: DBConfig.clientId,
            secret: DBConfig.secret
        });
    } else if (FileConfig) {
        ServiceConfiguration.configurations.insert({
            service: "google",
            appId: FileConfig.service.google.env.Live.clientId,
            secret: FileConfig.service.google.env.Live.secret
        });
        Config.insert({
            "service":"google",
            "env":"Live",
            "clientId": FileConfig.service.google.env.Live.clientId,
            "secret": FileConfig.service.google.env.Live.secret
        });
        Config.insert({
            "service":"google",
            "env":"Dev",
            "clientId": FileConfig.service.google.env.Dev.clientId,
            "secret": FileConfig.service.google.env.Dev.secret
        });        
    } else {
        console.log("Error setting up Google service, using default values");
        ServiceConfiguration.configurations.insert({
            service: "google",
            clientId: "",
            secret: ""
        });
    }

    DBConfig = Config.findOne({ "service": "imgur" });

    if (DBConfig) {
        //Imgur config found
    } else if (FileConfig) {
        Config.insert({
            "service":"imgur",
            "client_id": FileConfig.service.imgur.client_id,
            "client_secret": FileConfig.service.imgur.client_secret,
            "refresh_token": FileConfig.service.imgur.refresh_token
        });
    } else {
        console.log("Error setting up Imgur service");
    }
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