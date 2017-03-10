import './mebrew.html';
import './mebrew.css';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
import { BrewFiles } from '../../api/collections/coffees.js';
import { Coffee } from '../../../lib/DatabaseModels.js';
import { Brewfile } from '../../../lib/DatabaseModels.js';
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
      let brewfile = new Brewfile({username: user, tagline: Tagline, imageurl: url});
      Meteor.call('brewfile.updateProfile',brewfile.Get(), (err, res) => {
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
    if(!!Favorites.find() && Favorites.find().fetch().length !== 0){
      console.log(Favorites.find().fetch());
      return Favorites.find();
    }
  },
  meBrews (){
    let user = FlowRouter.getParam('userName');
    let coffeeCriteria = new Coffee({username: user});
    return Coffees.find(coffeeCriteria);
  },
  brew (element) {
    console.log(element.hash.name._id);
      return Coffees.find({_id:element.hash.name._id});
  },
  Favbrew (element) {
    return Coffees.find({_id: element.hash.name.brewid});
  },
  getImage(){
    if(BrewFiles.findOne()){
      let user = FlowRouter.getParam('userName')
      let brewfile = new Brewfile(BrewFiles.findOne());
      console.log("onyl", brewfile.OnlyImageUrl().ImageUrl);
      return brewfile.OnlyImageUrl().ImageUrl;
    }
  },
  getTagline(){
    var brewfile = new Brewfile({username: FlowRouter.getParam('userName')});
    if(BrewFiles.findOne(brewfile.OnlyUsername()))
    {
      return BrewFiles.findOne(brewfile.OnlyUsername()).Tagline;
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
