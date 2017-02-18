import { Coffees } from '../../imports/api/collections/coffees.js';


if(Meteor.isServer){
  Meteor.methods({
    'coffees.removeById'(id){
      check( id, Match.OneOf( String, null, undefined ) );
      Coffees.remove(id);
    }
  });
}
