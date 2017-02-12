import { BrewFiles } from '../../imports/api/collections/coffees.js';

if (Meteor.isServer) {
  Meteor.publish('brewfile', (user) => {
    check (user, Match.OneOf(String, null, undefined));
    console.log(user);
    return BrewFiles.find({user: user})
  });
}
