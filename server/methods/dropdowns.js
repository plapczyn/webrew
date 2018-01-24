import { Roasters } from '../../imports/api/collections/coffees.js';

if(Meteor.isServer){
    Meteor.methods({
        'roasters.dropdown'(search, limit){
            let reg = new RegExp(search, "i");
            return Roasters.find({Name: {$regex: reg}}).fetch().map((roaster) => {return {key: roaster._id._str, value: roaster.Name}});
        }
    });
}