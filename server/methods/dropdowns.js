import { Brands } from '../../imports/api/collections/coffees.js';
import WebrewInputDbMethods from '../../lib/WebrewInputMethods.js';

if (Meteor.isServer) {
    Meteor.methods({
        'brands.dropdown'(criteria) {
            return WebrewInputDbMethods.GetDropdownList({
                criteria: criteria,
                document: Brands,
                valueProperty: "Name"
            });
        }
    });
}