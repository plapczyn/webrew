import { Rebrews } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
  Meteor.methods({
    ///favorite structure:
    ///{user: String, name: String}
    'rebrews.add'(rebrew){
      Rebrews.insert(rebrew);
    }
  });
}
