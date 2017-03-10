import { BrewFiles } from '../../imports/api/collections/coffees.js';
import { Brewfile } from '../../lib/DatabaseModels.js';

if (Meteor.isServer) {
  Meteor.publish('brewfile', (user) => {
    let usr = user.trim();
    check (user, Match.OneOf(String, null, undefined));
    let brewfile = new Brewfile({username: user})
    let crit = brewfile.Get();
    console.log("ok", BrewFiles.findOne(crit));
    // console.log("AERAER",brewfile.Get())
    return BrewFiles.find(brewfile.Get());
  });
}
