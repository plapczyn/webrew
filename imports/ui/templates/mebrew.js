import './mebrew.html';
import './mebrew.css';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
import { BrewFiles } from '../../api/collections/coffees.js';
import { Coffee } from '../../../lib/DatabaseModels.js';
import { Brewfile } from '../../../lib/DatabaseModels.js';
import Common from '../common/scripts/common.js';
import '../templates/modals/mebrew/meModal.js';
import '../common/templates/webrewLoader.html';

Template.mebrew.onCreated( () => {
  let template = Template.instance();
  let user = FlowRouter.getParam('userName');
  template.userName = new ReactiveVar(user);

  template.subscribe('coffees.mebrew', user, function () {
    //subsReady
    $('.loader').fadeOut('fast', function(){
      $('.loading-wrapper').fadeIn('slow');
    });
  });

  template.autorun(() => {
    template.subscribe('coffees.mebrew', template.userName.get());

    template.subscribe('favorites', template.userName.get(), () => {
    });
  });
});

Template.mebrew.onRendered( function() {
  $('.loader').fadeIn();
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
    return Coffees.find(coffeeCriteria,{ sort: {CreatedAt: -1}});
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
    if (Meteor.user().username == FlowRouter.getParam('userName')) {
      return true;
    }else {
      return false;
    }
  },
  otherUser() {
    return FlowRouter.getParam('userName');
  }
});
