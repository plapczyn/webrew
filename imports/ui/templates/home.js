import './home.html'

import { Coffees } from '../../api/collections/coffees.js';

Template.Home.helpers({
  /*
  coffees: [
    { name: "Duncan Donuts", roast: "Medium Roast" },
    { name: "Kirkland 5000", roast: "Medium Roast" },
    { name: "Starbucks Pike Place", roast: "Medium Roast" },
    { name: "Tim Hortons", roast: "Dark Roast" },
  ],
  */
  coffees () {
      return Coffees.find({});
    },

});
