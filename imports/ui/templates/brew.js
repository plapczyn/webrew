import './brew.html';

import { Coffees } from '../../api/collections/coffees.js';

Template.brew.helpers({
  brew () {
      return Coffees.find({name: FlowRouter.getParam("brewId")});
    },

});
