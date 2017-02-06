import './mebrew.html';
import './mebrew.css';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
import { BrewFiles } from '../../api/collections/coffees.js';
Template.mebrew.onCreated(() => {
  // var t = Meteor.user().username;
});

Template.mebrew.events({
  'click .goMe' (event){
    FlowRouter.go('mebrew', {userName: Meteor.user().username})
  },
  'submit .changeImage'(event){
    event.preventDefault();
    var url = event.target.url.value;

    var secure = Promise.resolve(Meteor.user()).then(function(data){
      if(Meteor.user().username == FlowRouter.getParam('userName')){
        try{
          console.log("ASDASDASDA");
          var id = BrewFiles.findOne({user: Meteor.user().username})._id;
          BrewFiles.update({_id: id}, {$set: {imageURL: url}});
        }
        catch(e){
          BrewFiles.insert({user: Meteor.user().username, imageURL: url});
        }
      }
      })
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
    return Coffees.find({name:element.hash.name.name});
  },
  getImage(){
    if(BrewFiles.findOne({user: FlowRouter.getParam('userName')})){
    return BrewFiles.findOne({user: FlowRouter.getParam('userName')}).imageURL;
  }},
  isUser(){
    if(!!Meteor.user()){
      if(Meteor.user().username == FlowRouter.getParam('userName')){
        return "modal";
      }
      else{
        return "";
      }
    }
  }

});
