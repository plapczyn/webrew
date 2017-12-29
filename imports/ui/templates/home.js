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

  let template = Template.instance();
  // template.searching   = new ReactiveVar( false );
  template.searchQuery = new ReactiveVar();
});

Template.Home.onRendered( function() {
  $('.loader').fadeIn();
});

Template.Home.helpers({
  coffees () {
    return Coffees.find({},{ sort: { CreatedAt: -1 } });
  },
  query() {
    return Template.instance().searchQuery.get();
  },
});



Template.Home.events({
  'click .goMe' (event){
    FlowRouter.go('mebrew', {userName: Meteor.user().username})
  },
  'keyup [name="search"]' ( event) {
    let value = event.target.value.trim();
    Template.instance().searchQuery.set(value)

    if ( value === '' ) {
      Template.instance().searchQuery.curValue =  value;
    }
  }
});
