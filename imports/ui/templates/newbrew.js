import './newbrew.html';
import './newbrew.css';

import { Coffees } from '../../api/collections/coffees.js';
import Common from '../scripts/common.js';
import { Coffee } from '../../../lib/DatabaseModels.js';
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
    let obj = {
      coffeename: name.trim(),
      coffeeroast: roast.trim(),
      coffeedescription: description.trim(),
      imageURL: imageURL.trim(),
    };

    Meteor.call('coffees.add', obj , (err, res) => {
      if(!err){
        Common.WebrewToast.Show("New Brew was added!", "It's a Good Brew!", "sucess");
        FlowRouter.go('Main');
      }
      else {
        Common.WebrewToast.Show(obj.coffeename + ' already exists. click to check it out.', null, "error");
      }
    });

    // Clear form
  },

  //Goto Profile
  'click .goMe' (event){
    FlowRouter.go('mebrew', {userName: Meteor.user().username})
  },
  'click .newbrew' (event){
    console.log("Event nebrew");
    $('[data-toggle="tooltip"]').tooltip();
  }
});

Template.newbrew.helpers({
  //    submitterImage(){
//        return BrewFiles.findOne({user:this.user}).imageURL;
  //    }
});
