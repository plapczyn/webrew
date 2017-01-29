import './home.html';

import { Coffees } from '../../api/collections/coffees.js';

Template.Home.helpers({
  coffees () {
    return Coffees.find({},{ sort: { createdAt: -1 } });
  },
});
