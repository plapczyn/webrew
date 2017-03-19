import './rebrew.html'
import { BrewFiles } from '../../api/collections/coffees.js';
import { Brewfile } from '../../../lib/DatabaseModels.js';
import { Rebrew } from '../../../lib/DatabaseModels.js';

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
    let brewfile = BrewFiles.findOne({Username: this.user});
    if(brewfile){
      let returnValue = new Brewfile(brewfile);
      return returnValue.OnlyImageUrl().ImageUrl;
    }
  },
  isOwner(){
    return this.owner === Meteor.userId();
  },
});

Template.rebrew.events({
    'click .delRebrewModal'(event) {
        document.getElementById("DelrebrewID" + this.id).value = this.id;
    },
    'click .editRebrewModal'(event) {
        document.getElementById("EditrebrewID" + this.id).value = this.id;
    },
    'click .delete'(event) {
      console.log(this);
        var brew = FlowRouter.getParam('brewId')
        Toast.options = {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-left',
            showEasing: 'swing',
            hideEasing: 'linear',
            showMethod: 'fadeIn',
            hideMethod: 'fadeOut',
            timeOut: 1500,
            color: 'red'
        };
        // Hide Modal
        var ID = this.id;
        $("#DeletereBrewModal" + ID).on("hidden.bs.modal", function (){
            //Remove reBrew from the collection
            // let id = document.getElementById("DelrebrewID" + Template.instance().id).value
            // var idd = Template.instance().data.id;
            Meteor.call('rebrews.removeById', ID, (err, res) => {

            });
        });
        $("#DeletereBrewModal" + Template.instance().data.id).modal("hide");
    },
    'submit .EditsubmitRebrew'(event){
        event.preventDefault();
        let rebrew = {};
        rebrew._id = document.getElementById("EditrebrewID" + this.id).value;
        rebrew.title = event.target.title.value;
        rebrew.rebrew = event.target.rebrew.value;
        rebrew.rating = event.target.rating.value;
        let updateRebrew = new Rebrew(rebrew);
        Meteor.call('rebrews.updateRebrew',updateRebrew.Get(), (err, res) => {
            $("#EditreBrewingModal" + this.id).modal("hide");
        });
    },
    //Goto Profile
    'click .goMe' (event){
        FlowRouter.go('mebrew', {userName: Meteor.user().username});
    },
    //Star Rating
    'click .rating'(event) {
        const value = $(event.target).val();
        $("#erating" + Template.instance().data.id).val(value);
    }
});
