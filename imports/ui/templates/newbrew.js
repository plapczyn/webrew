import './newbrew.html';
import './newbrew.css';

import { Coffees } from '../../api/collections/coffees.js';

Template.newbrew.events({
  'submit .newbrew'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const name = target.name.value;
    const roast = target.roast.value;
    const description = target.description.value;
    const imageURL = target.imageURL.value;

    // Insert a new coffee into the collection
    Coffees.insert({
      name: name,
      roast: roast,
      description: description,
      imageURL: imageURL,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
    
    // Clear form
    FlowRouter.go('Main');
  },
  
  //Goto Profile
  'click .goMe' (event){
      FlowRouter.go('mebrew', {userName: Meteor.user().username})
  }

});
