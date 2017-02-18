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

    // Check if brew exists in collection
    var isFound = Coffees.findOne({name: name.trim(),});
    if (isFound == null){
        // Insert a new coffee into the collection
        Coffees.insert({
            name: name.trim(),
            roast: roast.trim(),
            description: description,
            imageURL: imageURL.trim(),
            createdAt: new Date(),
            owner: Meteor.userId(),
            username: Meteor.user().username,
        });

        // Clear form
        FlowRouter.go('Main');
    } else {
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
            onclick: function () {FlowRouter.go('/brew/' + isFound.name);}
        };
        Toast.error(isFound.name + " was already added by " + isFound.username + '. Click to check it out.' );
    }
  },

  //Goto Profile
  'click .goMe' (event){
      FlowRouter.go('mebrew', {userName: Meteor.user().username})
  }

});

Template.newbrew.helpers({
//    submitterImage(){
//        return BrewFiles.findOne({user:this.user}).imageURL;
//        console.log(this)
//    }
});