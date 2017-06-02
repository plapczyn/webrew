import { Meteor } from 'meteor/meteor';
import {Check} from 'meteor/check';
import {Rebrews} from '../imports/api/collections/coffees.js';

Meteor.startup(() => {
  // code to run on server at startup
});

ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.insert({
    service: "facebook",
    appId: '422461951458041',
    secret: '55f64372f1df13e4a6d6cd8d38509405'
});

Accounts.onCreateUser(function (options, user) {

    if (!user.services.facebook) {
        return user;
    }
    user.username = user.services.facebook.name;
    user.emails = [{address: user.services.facebook.email}];

    return user;
});