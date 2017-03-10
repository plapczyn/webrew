import './newbrew.html';
import './newbrew.css';

import { Coffees } from '../../api/collections/coffees.js';

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
        Toast.info("Brew was successfully added!");
        FlowRouter.go('Main');
      }
      else {
        Toast.options = {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-bottom-center',
          showDuration: '5000',
          hideDuration: '5000',
          timeOut: '5000',
          showEasing: 'swing',
          hideEasing: 'linear',
          showMethod: 'fadeIn',
          hideMethod: 'fadeOut',
          color: 'red',
          onclick: function () {FlowRouter.go('/brew/' + obj.coffeename);}
        };
        Toast.error(obj.coffeename + ' already exists. click to check it out.' );
      }
    });

    // Clear form
  },

  //Goto Profile
  'click .goMe' (event){
    FlowRouter.go('mebrew', {userName: Meteor.user().username})
  }

});

Template.newbrew.helpers({
  //    submitterImage(){
//        return BrewFiles.findOne({user:this.user}).imageURL;
  //    }

});
