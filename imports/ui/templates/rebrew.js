import './rebrew.html'
import { BrewFiles } from '../../api/collections/coffees.js';

Template.rebrew.onCreated(() => {
  var user = Template.instance().data.user;
  var template = Template.instance();
  var imageUrl = new ReactiveVar('');
  template.autorun( () => {
    template.subscribe( 'brewfile', user, () => {
      setTimeout( () => {
      }, 300 );
    });
  });
});

Template.rebrew.helpers({
  submitterImage(){
    let brewfile = BrewFiles.findOne({user:this.user});
    if(brewfile){
      return brewfile.imageURL;
    }
  }
});

Template.rebrew.events({
    //Goto Profile
    'click .goMe' (event){
        FlowRouter.go('mebrew', {userName: Meteor.user().username})
    }
});
