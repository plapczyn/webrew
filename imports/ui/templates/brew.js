import './brew.html';
import './brew.css';
import './modals/rebrew/advancedRebrewModal.js';
import './brewChart.js';
import Common from '../scripts/common.js';
import Chart from 'chart.js';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
import { Rebrews } from '../../api/collections/coffees.js';
import { Favorite } from '../../../lib/DatabaseModels.js';
import { AdvancedRebrew } from '../../../lib/DatabaseModels.js';
import { Rebrew } from '../../../lib/DatabaseModels.js';
import { Coffee } from '../../../lib/DatabaseModels.js';

Template.brew.onRendered(() => {
});
Template.brew.onCreated(function (){

  var template = Template.instance();
  template.isReBrewing = new ReactiveVar(false);

  var brewName = FlowRouter.getParam('brewId');

  template.autorun( () => {
    let user = "";

    if(Meteor.user()){
      user = Meteor.user().username;
    }
    template.subscribe('favorites.isInFavorites', user, () => {
      setTimeout( () => {
      }, 300 );
    })
  });
});

Template.brew.helpers({
  isReady: function(sub) {
    if(sub) {
      return FlowRouter.subsReady(sub);
    } else {
      return FlowRouter.subsReady();
    }
  },
  addingRebrew: false,
  brew () {
    return Coffees.find();
  },

  isOwner(){
    return this.CoffeeOwner === Meteor.userId();
  },

  InFavorites(){
    let favorite =  Favorites.findOne({CoffeeId: this._id});

    if(!favorite){
      return true;
    }
    return false;
  },

  reBrew(){
    return Rebrews.find();
  },
  reBrewCount(){
    return Rebrews.find().count();
  },
  rebrewing(){
    return Template.instance().isReBrewing.get();
  },

  setAdvanced(advanced){
    Template.instance().isAdvanced.set(advanced);
  }
});

Template.brew.events({
  'click .delModal'(event) {
    document.getElementById("brewID").value = this._id;
  },
  'click .delete'(event) {

    var brew = FlowRouter.getParam('brewId');

    // Hide Modal
    $("#DeleteBrewModal").on("hidden.bs.modal", function (){
      //Remove coffee from the collection
      let id = document.getElementById("brewID").value
      Meteor.call('coffees.removeById', id, (err, res) => {
        if(!err){
          Common.WebrewToast.Show(brew + " was removed", null, "info")
        }
        else{
          Common.WebrewToast.Show(brew + " was not removed successfully", "Error", "error")
        }
      });
      FlowRouter.go('Main');
    });
    $("#DeleteBrewModal").modal("hide");
  },

  'click .addToFavorites'(event){
    var userName = Meteor.user().username;
    var brew = FlowRouter.getParam('brewId');
    var brewid = this._id;
    var favorite = {Username: userName, CoffeeId: brewid};
    Meteor.call('favorites.add', favorite, (err, res) => {
      if(!err){
        Common.WebrewToast.Show(brew + " was added to your favorites", "Error", "info")
      }
      else{
        Common.WebrewToast.Show(brew + " was not added to your favorites. An error occured", "Error", "error")
      }
    });
  },

  'click .removeFromFavorites'(event){
    event.preventDefault();
    var user = Meteor.user().username;
    var brew = FlowRouter.getParam('brewId');
    var brewid = this._id;
    Meteor.call('favorites.remove', brewid, user,  (err, res) => {
      if(!err){
        Common.WebrewToast.Show(brew + " was removed from your favorites", null, "info")
      }
      else{
        Common.WebrewToast.Show(brew + " was not removed from your favorites and error has occured", null, "error")
      }
    });
  },
  'click .addRebrew'(event){
    var instance = Template.instance();
    instance.isReBrewing.set(!instance.isReBrewing.get());
  },


  //Edit Brew
  'click .editModal'(event) {
    document.getElementById("editbrewID").value = this._id;

  },
  'submit .submitEditBrew'(event){
    //prevent the refresh page and put params in
    event.preventDefault();

    //update database
    let editBrew = {};
    const target = event.target;
    editBrew.coffeename = target.title.value;
    editBrew.coffeeroast = target.roast.value;
    editBrew.imageURL = target.imageURL.value;
    editBrew.coffeedescription = target.description.value;
    editBrew._id = document.getElementById("editbrewID").value;
    let coffee = new Coffee(editBrew);

    $("#EditBrewModal").on("hidden.bs.modal", function (){
      Meteor.call('coffees.edit', coffee.Get(), (err, res) => {
        if(!err){
          FlowRouter.go('/brew/' + editBrew.coffeename);
        } else {
          Common.WebrewToast.Show(editBrew.name + " already exists.", null, "error")
        }
      });
    });
    $("#EditBrewModal").modal("hide");
  },
  //Goto Profile
  'click .goMe' (event){
    FlowRouter.go('mebrew', {userName: Meteor.user().username});
  }
});
