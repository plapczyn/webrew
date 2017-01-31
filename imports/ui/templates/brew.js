import './brew.html';

import { Coffees } from '../../api/collections/coffees.js';

Template.brew.helpers({
  brew () {
    return Coffees.find({name: FlowRouter.getParam("brewId")});
  },
  isOwner(){
    return this.owner === Meteor.userId();
  }
});

Template.brew.events({
  'click .delete'(event) {
    // Remove coffee from the collection
    Coffees.remove(this._id);
    FlowRouter.go('Main');
  },
});
