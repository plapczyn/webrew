import './newbrew.html';

import { Coffees } from '../../api/collections/coffees.js';

Template.newbrew.events({
  'submit .newbrew'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const name = target.name.value;
    const roast = target.roast.value;

    // Insert a task into the collection
    Coffees.insert({
      name: name,
      roast: roast,
      createdAt: new Date(), // current time
    });

    // Clear form
    target.name.value = '';
    target.roast.value = '';
    FlowRouter.go('Main');
  },
});
