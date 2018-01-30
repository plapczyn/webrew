import { Brands } from '../../imports/api/collections/coffees.js';
import WebrewInputDbMethods from '../../lib/WebrewInputMethods.js';

if (Meteor.isServer) {
    Meteor.methods({
        'brands.dropdown'(search, key, limit) {
            return WebrewInputDbMethods.GetDropdownList({
                search: search,
                key: key,
                limit: limit,
                document: Brands,
                valueProperty: "Name"
            });
        }
    });
}