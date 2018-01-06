import './home.html';
import './home.css'
import '../common/templates/webrewLoader.html';

import { Coffees } from '../../api/collections/coffees.js';

Template.Home.onCreated( function (){
  this.subscribe('webrewHome', function (data) {
    //subsReady
    $('.loader').fadeOut('fast', function(){
      $('.loading-wrapper').fadeIn('slow');
    });
  });
});

Template.Home.onRendered( function() {
  $('.loader').fadeIn();
});

Template.Home.helpers({
  coffees () {
    return Coffees.find({},{ sort: { CreatedAt: -1 } });
  }
});

Template.Home.events({
  'click .goMe' (event){
    FlowRouter.go('mebrew', {userName: Meteor.user().username})
  },
  'click .goOut' (event) {
    Meteor.logout();
  }
});
