import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './body.html';

Template.body.helpers({
  coffees: [
    { name: "Duncan Donuts Medium Roast" },
    { name: "Kirkland 5000" },
    { name: "Starbucks Pike Place Roast" },
  ],
});
