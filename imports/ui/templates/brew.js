import './brew.html';

import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';

Template.brew.helpers({
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
  }
});

Template.brew.events({
  'click .delete'(event) {
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
  }
});
