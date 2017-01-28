import './mebrew.html'
import './mebrew.css'

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
