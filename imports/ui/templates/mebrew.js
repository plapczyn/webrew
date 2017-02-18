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
  template.searchText = new ReactiveVar("");

  template.autorun( () => {
    // template.subscribe( 'brewfile', user, () => {
    //   setTimeout( () => {
    //   }, 300 );
    // });
    // Gather
    // this.register('myPost', Meteor.subscribe('brewfile', params.userName));
    // this.register('coffeesForBrewfileClient', Meteor.subscribe('coffees.myCoffees', params.userName));
    template.subscribe('coffees.mebrew', user, template.searchText.get());

    template.subscribe('favorites', user, () => {
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
    var user = Meteor.user().username;
    if(Meteor.user().username == FlowRouter.getParam('userName')){
      Meteor.call('brewfile.updateImage',{url: url, tagline: Tagline, user: user}, (err, res) => {
        $("#meBrewModal").modal("hide");
      });
    }
  })
},
'keyup [name="search"]' ( event) {
  let value = event.target.value.trim();
  Template.instance().searchText.set(value)
  if ( value === '' ) {
    Template.instance().searchText.curValue =  value;
  }
}
});

Template.mebrew.helpers({
  name: FlowRouter.getParam("userName"),
  info: "Tell us a little about yourself and how you like to Brew? Click the image to update!",
  favorites(){
    return Favorites.find();
  },
  meBrews (){
    let user = "";
    if(Meteor.user()){
      user = Meteor.user().username
    }
    return Coffees.find({username: user});
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
