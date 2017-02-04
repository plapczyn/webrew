import './home.html';
import './home.css'

import { Coffees } from '../../api/collections/coffees.js';

Template.Home.helpers({
  coffees () {
    return Coffees.find({},{ sort: { createdAt: -1 } });
  },
});

Template.Home.events({
  'click .goMe' (event){
    FlowRouter.go('mebrew', {userName: Meteor.user().username})

  }
})
