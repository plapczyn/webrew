import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './body.html';
import './templates/coffee.html';

Template.body.helpers({
  coffees: [
    { name: "Duncan Donuts", roast: "Medium Roast" },
    { name: "Kirkland 5000", roast: "Medium Roast" },
    { name: "Starbucks Pike Place", roast: "Medium Roast" },
    { name: "Tim Hortons", roast: "Dark Roast" },
  ],
});
