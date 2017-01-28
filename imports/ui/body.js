import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './body.html';
import './templates/coffee.html';
import './templates/mebrew.html';

Template.Home.helpers({
  coffees: [
    { name: "Duncan Donuts", roast: "Medium Roast" },
    { name: "Kirkland 5000", roast: "Medium Roast" },
    { name: "Starbucks Pike Place", roast: "Medium Roast" },
    { name: "Tim Hortons", roast: "Dark Roast" },
  ],

});

Template.mebrew.onCreated(() =>{
  this.counter = 0;

});

Template.mebrew.events({
  'click .test':(event) => {
    console.log("Event test" + this.counter);
    this.counter++;
  }
});

Template.mebrew.helpers({
  name: "Paul",
  pictureUrl:"img/Paul.jpg",
  coffeeReviews:[{},{}]
})
