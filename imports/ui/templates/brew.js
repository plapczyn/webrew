import './brew.html';
import './brew.css';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
import { Rebrews } from '../../api/collections/coffees.js';

Template.brew.onCreated(function (){
  var instance = this;
  instance.isReBrewing = new ReactiveVar(false);
});

Template.brew.helpers({
  addingRebrew: false,
  brew () {
    return Coffees.find({name: FlowRouter.getParam("brewId")});
  },
  isOwner(){
    return this.owner === Meteor.userId();
  },
  InFavorites(){
    let username = Meteor.user().username;
    let brew = FlowRouter.getParam("brewId");
    let favorite =  Favorites.findOne({user: username, name: brew});

    if(!favorite){
      return true;
    }
    return false;
  },
  reBrew(){
    return Rebrews.find({brew: FlowRouter.getParam('brewId')});
  },
  rebrewing(){
    return Template.instance().isReBrewing.get();
  }
});

Template.brew.events({
  'click .delete'(event) {
    var brew = FlowRouter.getParam('brewId')
    Toast.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-left',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
      timeOut: 1500,
      color: 'red'
    };
    Toast.info(brew + " was removed");
    // Remove coffee from the collection
    Coffees.remove(this._id);
    FlowRouter.go('Main');
  },
  'click .addToFavorites'(event){
    var userName = Meteor.user().username;
    var brew = FlowRouter.getParam('brewId')
    Favorites.insert({user: userName, name:brew });
    Toast.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-left',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
      timeOut: 1500,
      color: 'red'
    };
    Toast.info(brew + " was added to your favorites");
  },
  'click .removeFromFavorites'(event){
    event.preventDefault();
    var user = Meteor.user().username;
    var brew = FlowRouter.getParam('brewId');
    var favoriteId = Favorites.findOne({user: user, name: brew})._id;
    Favorites.remove({_id: favoriteId});
    Toast.options = {
      closeButton: true,
      progressBar: true,
      positionClass: 'toast-top-left',
      showEasing: 'swing',
      hideEasing: 'linear',
      showMethod: 'fadeIn',
      hideMethod: 'fadeOut',
      timeOut: 1500,
      color: 'red'
    };
    Toast.info(brew + " was removed from your favorites");
  },
  'click .addRebrew'(event){
    var instance = Template.instance();
    instance.isReBrewing.set(!instance.isReBrewing.get());
  },
  'submit .submitRebrew'(event){
    //prevent the stupid refresh page and put params in
    event.preventDefault();

    //grab form data
    const target = event.target;
    const title = target.title.value;
    const rebrew = target.rebrew.value;
    const rating = target.rating.value;
    const user = Meteor.user().username;
    const reviewdate = Date.now();
    let brew = FlowRouter.getParam('brewId');

    //update database
    Rebrews.insert({
      user: user,
      brew: brew,
      rebrew: rebrew,
      rating: rating,
      title: title,
      reviewdate: reviewdate
    });

    //resetform and refresh page
    Template.instance().isReBrewing.set(false);
    let name = FlowRouter.getParam('brewId');
    FlowRouter.go('brew', {brewId: name});

  },
    //Goto Profile
  'click .goMe' (event){
      FlowRouter.go('mebrew', {userName: Meteor.user().username})
  }

});
