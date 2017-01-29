import './mebrew.html';
import './mebrew.css';
import { Coffees } from '../../api/collections/coffees.js';

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
  pictureUrl:"/img/Paul.jpg",
  coffeeReviews:[{name:"TEST"},{},{},{},{},{}],
  info: "This is some test information... I LOVE INFORMATION",
  favorites: ["Kirkland", "Tyler's Treat"],

  brew (element) {
    return Coffees.find({name:element.hash.name});
  }
});
