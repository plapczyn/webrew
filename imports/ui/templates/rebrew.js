import './rebrew.html'

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
  }
});

Template.review.events({
    //Goto Profile
    'click .goMe' (event){
        FlowRouter.go('mebrew', {userName: Meteor.user().username})
    }
});
