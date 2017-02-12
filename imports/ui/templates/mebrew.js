import './mebrew.html';
import './mebrew.css';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
import { BrewFiles } from '../../api/collections/coffees.js';
Template.mebrew.onCreated(() => {
  // var t = Meteor.user().username;
  let template = Template.instance();
  let user = FlowRouter.getParam('userName');
  template.searching = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'brewfile', user, () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
    template.subscribe('favorites', user, () => {
      setTimeout( () => {
      }, 300 );
    });

    template.subscribe('coffeesForBrewfile', user, () => {
      setTimeout( () => {
      }, 300 );
    });
  });
});

Template.mebrew.events({
  'click .goMe' (event){
    FlowRouter.go('mebrew', {userName: Meteor.user().username})
  },
  'submit .changeProfile'(event){
    event.preventDefault();
    var url = event.target.url.value;
    var Tagline = event.target.tagline.value;
    var secure = Promise.resolve(Meteor.user()).then(function(data){
      if(Meteor.user().username == FlowRouter.getParam('userName')){
        var id = BrewFiles.findOne({user: Meteor.user().username})._id;
        try{
          BrewFiles.update({_id: id}, {$set: {imageURL: url}})
        }
        catch(e){
          BrewFiles.insert({user: Meteor.user().username, imageURL: url});
        }

        try{
          BrewFiles.update({_id: id}, {$set: {tagline: Tagline}})
        }
        catch(e){
          BrewFiles.insert({user: Meteor.user().username, tagline: Tagline});
        }
        $("#meBrewModal").modal("hide");
      }
    })
  }
});

Template.mebrew.helpers({
  name: FlowRouter.getParam("userName"),
  info: "Tell us a little about yourself and how you like to Brew? Click the image to update!",
  favorites(){
    console.log(Favorites.findOne());
    return Favorites.find();
  },
  meBrews (){
    console.log(Coffees.findOne())
    return Coffees.find({username: FlowRouter.getParam("userName")})
  },

  brew (element) {
    return Coffees.find({name:element.hash.name.name});
  },
  getImage(){
    if(BrewFiles.findOne({user: FlowRouter.getParam('userName')})){
      return BrewFiles.findOne({user: FlowRouter.getParam('userName')}).imageURL;
    }
  },
  getTagline(){
    if(BrewFiles.findOne({user: FlowRouter.getParam('userName')})){
      return BrewFiles.findOne({user: FlowRouter.getParam('userName')}).tagline;
    }
  },
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
