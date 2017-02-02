import './mebrew.html';
import './mebrew.css';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
Template.mebrew.onCreated(() =>{
});

Template.mebrew.events({
  'click .test':(event) => {
    console.log("Event test" + this.counter);
    this.counter++;
  }
});

Template.mebrew.helpers({
  name: FlowRouter.getParam("userName"),
  pictureUrl:"/img/Paul.jpg",
  info: "This is some test information... I LOVE INFORMATION",
  favorites(){
    return Favorites.find({user: FlowRouter.getParam("userName")})
  },
  meBrews (){
    return Coffees.find({username: FlowRouter.getParam("userName")})
  },

  brew (element) {
    console.log(element.hash.name)
    return Coffees.find({name:element.hash.name.name});
  }
});
