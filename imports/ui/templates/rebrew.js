import './rebrew.html'
import { BrewFiles } from '../../api/collections/coffees.js';
import { Brewfile } from '../../../lib/DatabaseModels.js';

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
        document.getElementById("DelrebrewID").value = this.id;
    },
    'click .editRebrewModal'(event) {
        document.getElementById("EditrebrewID").value = this.id;
    },
    'click .delete'(event) {

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
        $("#DeletereBrewModal").on("hidden.bs.modal", function (){
            //Remove reBrew from the collection
            let id = document.getElementById("DelrebrewID").value
            Meteor.call('rebrews.removeById', id, (err, res) => {

            });
        });
        $("#DeletereBrewModal").modal("hide");
    },
    'submit .EditsubmitRebrew'(event){
        event.preventDefault();
        let rebrew = {};
        rebrew.id = document.getElementById("EditrebrewID").value;
        rebrew.title = event.target.title.value;
        rebrew.rebrew = event.target.rebrew.value;
        rebrew.rating = event.target.erating.value;
        Meteor.call('rebrews.updateRebrew',rebrew, (err, res) => {
            $("#EditreBrewingModal").modal("hide");
        });
    },
    //Goto Profile
    'click .goMe' (event){
        FlowRouter.go('mebrew', {userName: Meteor.user().username});
    },
    //Star Rating
    'click .rating'(event) {
        const value = $(event.target).val();
        $("#erating").val(value);
    }
});
