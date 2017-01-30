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

    // Insert a new coffee into the collection
    Coffees.insert({
      name: name,
      roast: roast,
      description: description,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });

    // Clear form
    FlowRouter.go('Main');
  },
});
