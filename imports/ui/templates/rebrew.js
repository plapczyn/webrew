import './rebrew.html'
import { BrewFiles } from '../../api/collections/coffees.js';
Template.rebrew.helpers({
    ratingFull(count){
    var countArr = [];
    for (var i=0; i<count; i++){
      countArr.push({});
    }
    return countArr;
  },
    ratingNone(count){
    var countArr = [];
    for (var i=0; i< 5 - count; i++){
      countArr.push({});
    }
    return countArr;
  },
  submitterImage(){
    return BrewFiles.findOne({user:this.user}).imageURL;
    console.log(this)
  }
});

Template.rebrew.events({
    //Goto Profile
    'click .goMe' (event){
        FlowRouter.go('mebrew', {userName: Meteor.user().username})
    }
});
