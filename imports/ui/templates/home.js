import './home.html';
import './home.css'
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
  // if (!Meteor.user()){
  //   FlowRouter.go("/login");
  // }
  $('.loader').fadeIn();
});

Template.Home.helpers({
  coffees () {
    return Coffees.find({},{ sort: { CreatedAt: -1 } });
  }
});

// Template.Home.events({
// });
