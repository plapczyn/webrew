import { Roasters } from '../../imports/api/collections/coffees.js';
import WebrewInputDbMethods from '../../lib/WebrewInputMethods.js';

if (Meteor.isServer) {
    Meteor.methods({
        'roasters.dropdown'(search, key, limit) {
            return WebrewInputDbMethods.GetDropdownList({
                search: search,
                key: key,
                limit: limit,
                document: Roasters,
                valueProperty: "Name"
            });
        }
    });
}