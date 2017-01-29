import './brew.html';

import { Coffees } from '../../api/collections/coffees.js';

Template.brew.helpers({
  brew () {
    console.log(_id);
      return Coffees.find({name: FlowRouter.getParam('_id')});
    },

});
