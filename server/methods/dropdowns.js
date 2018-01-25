import { Roasters } from '../../imports/api/collections/coffees.js';

if (Meteor.isServer) {
    Meteor.methods({
        'roasters.dropdown'(search, key, limit) {
            console.log(key)
            let reg = new RegExp(search, "i");
            let query = { Name: { $regex: reg } }

            if (key != null && key != "") {
                query = { _id: key }
            }

            return Roasters.find(query, { sort: { Name: 1 }})
                .fetch().map((roaster) => {
                    return {
                        key: roaster._id, value: roaster.Name
                    }
                });
        }
    });
}