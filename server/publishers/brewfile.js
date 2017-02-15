import { BrewFiles } from '../../imports/api/collections/coffees.js';

if (Meteor.isServer) {
  Meteor.publish('brewfile', (user) => {
    console.log(user);
    let usr = user.trim();
    check (user, Match.OneOf(String, null, undefined));
    return BrewFiles.find({user: user});
  });
}
