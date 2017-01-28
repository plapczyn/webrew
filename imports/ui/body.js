import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './body.html';
import './templates/coffee.html';
import './templates/mebrew.html';

Template.body.helpers({
  coffees: [
    { name: "Duncan Donuts", roast: "Medium Roast" },
    { name: "Kirkland 5000", roast: "Medium Roast" },
    { name: "Starbucks Pike Place", roast: "Medium Roast" },
    { name: "Tim Hortons", roast: "Dark Roast" },
  ],
  users:[
    {
      name: "Paul",
      pictureUrl:"img/Paul.jpg",
      coffeeReviews:[{},{}]
    }
  ],
});
