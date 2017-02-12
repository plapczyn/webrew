import './home.html';
import './home.css'

import { Coffees } from '../../api/collections/coffees.js';

Template.Home.onCreated(()=>{
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

  template.autorun( () => {
    template.subscribe( 'coffeeSearch', template.searchQuery.get(), () => {
      setTimeout( () => {
        template.searching.set( false );
      }, 300 );
    });
  });
})


Template.Home.helpers({
  coffees () {
    return Coffees.find({},{ sort: { createdAt: -1 } });
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
    // Template.instance().searching.set( true );

    if ( value === '' ) {
      Template.instance().searchQuery.curValue =  value;
    }
    console.log(Template.instance().searchQuery)
  }
});
