import './mebrew.html';
import './mebrew.css';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
import { BrewFiles } from '../../api/collections/coffees.js';
import { Coffee } from '../../../lib/DatabaseModels.js';
import { Brewfile } from '../../../lib/DatabaseModels.js';
import Common from '../common/scripts/common.js';
import '../templates/modals/mebrew/meModal.js';

Template.mebrew.onCreated(() => {
  // var t = Meteor.user().username;
  let template = Template.instance();
  let user = FlowRouter.getParam('userName');
  template.searching = new ReactiveVar(false);
  template.searchText = new ReactiveVar("");

  template.autorun(() => {
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
  'click .goMe'(event) {
    FlowRouter.go('mebrew', { userName: Meteor.user().username })
  },
  'click .changeProfile'(event) {
    if (BrewFiles.findOne()) {
      var brewfile = new Brewfile(BrewFiles.findOne());
      var getImage = brewfile.OnlyImageUrl().ImageUrl;
      var getTagline = BrewFiles.findOne(brewfile.OnlyUsername()).Tagline;
      var getEmail = BrewFiles.findOne(brewfile.OnlyUsername()).Email;
      Common.WebrewModal.Show({
        template: "meBrewModal",
        title: "Profile Maintenance",
        data: {
          getImage: getImage,
          getTagline: getTagline,
          getEmail: getEmail
        },
        coffeeOk: true
      });
    }
  },
  'keyup [name="search"]'(event) {
    let value = event.target.value.trim();
    Template.instance().searchText.set(value)
    if (value === '') {
      Template.instance().searchText.curValue = value;
    }
  }
});

Template.mebrew.helpers({
  name: FlowRouter.getParam("userName"),
  info: "Tell us a little about yourself and how you like to Brew? Click the image to update!",
  favorites() {
    if (!!Favorites.find() && Favorites.find().fetch().length !== 0) {
      return Favorites.find();
    }
  },
  meBrews() {
    let user = FlowRouter.getParam('userName');
    let coffeeCriteria = new Coffee({ username: user });
    return Coffees.find(coffeeCriteria);
  },
  brew(element) {
    return Coffees.find({ _id: element.hash.name._id });
  },
  Favbrew(element) {
    return Coffees.find({ _id: element.hash.name.CoffeeId });
  },
  getImage() {
    if (BrewFiles.findOne()) {
      let user = FlowRouter.getParam('userName')
      let brewfile = new Brewfile(BrewFiles.findOne());
      return brewfile.OnlyImageUrl().ImageUrl;
    }
  },
  getTagline() {
    var brewfile = new Brewfile({ username: FlowRouter.getParam('userName') });
    if (BrewFiles.findOne(brewfile.OnlyUsername())) {
      return BrewFiles.findOne(brewfile.OnlyUsername()).Tagline;
    }
  },
  getEmail() {
    var brewfile = new Brewfile({ username: FlowRouter.getParam('userName') });
    if (BrewFiles.findOne(brewfile.OnlyUsername())) {
      return BrewFiles.findOne(brewfile.OnlyUsername()).Email;
    }
  },
  isUser() {
    if (!!Meteor.user()) {
      if (Meteor.user().username == FlowRouter.getParam('userName')) {
        return "modal";
      }
      else {
        return "";
      }
    }
  }

});
