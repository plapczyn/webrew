import './brew.html';
import './brew.css';
import './modals/rebrew/advancedRebrewModal.js';
import './brewChart.js';
import Common from '../common/scripts/common.js';
import Chart from 'chart.js';
import '../common/templates/imgupload.js'
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
  },

  getColor(){
    return Common.WebrewColorPallet.GetColor(this.CoffeeRoast);
  },
  hasAverageRating(){
    return this.AverageRating > 0;
  },
  GetCoffeeRating(){
    if(this.AverageRating > 0){
      return Math.round(this.AverageRating*2)/2.0;
    }
    else{
      return 0
    }
  }
});

Template.brew.events({
  'click .deleteModal' (event){
    Common.WebrewModal.Show({
      template: "modalDelete",
      title: "Delete this Brew?",
      okCallback: (evt, template) => {
        let id = Coffees.findOne()._id;
        var brew = FlowRouter.getParam('brewId');
        Meteor.call('coffees.removeById', id, (err, res) => {
          if(!err){
            Common.WebrewToast.Show(brew + " was removed", "info")
          }
          else{
            Common.WebrewToast.Show(brew + " was not removed successfully", "error", "Error")
          }
        });
        FlowRouter.go('Main');
      }
    })
  },
  'click .delete'(event) {

    var brew = FlowRouter.getParam('brewId');

    // Hide Modal
    $("#DeleteBrewModal").on("hidden.bs.modal", function (){
      //Remove coffee from the collection
      let id = document.getElementById("brewID").value
      Meteor.call('coffees.removeById', id, (err, res) => {
        if(!err){
          Common.WebrewToast.Show(brew + " was removed", "info")
        }
        else{
          Common.WebrewToast.Show(brew + " was not removed successfully", "error", "Error")
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
        Common.WebrewToast.Show(brew + " was added to your favorites", "success", "Favorite!")
      }
      else{
        Common.WebrewToast.Show(brew + " was not added to your favorites. An error occured", "error", "Error")
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
        Common.WebrewToast.Show(brew + " was removed from your favorites", "info")
      }
      else{
        Common.WebrewToast.Show(brew + " was not removed from your favorites and error has occured", "error")
      }
    });
  },
  
  'click .addRebrew' (event) {
    var instance = Template.instance();
    instance.isReBrewing.set(!instance.isReBrewing.get());
    Common.WebrewModal.Show({
      template: "advancedRebrewModal",
      title: "How was the brew?",
      coffeeOk: true,
      data: {
        coffeeId: this._id
      }
    });
  },

  //Edit Brew
  'click .editModal'(event) {
    let coffee = Coffees.findOne();

    Common.WebrewModal.Show({
      template: "modalEdit",
      coffeeOk: true,
      title: "Edit Brew",
      data: {
        ImageUrl: coffee.ImageUrl,
        CoffeeDescription: coffee.CoffeeDescription,
        CoffeeCompany: coffee.CoffeeCompany,
        CoffeeName: coffee.CoffeeName,
        id: coffee._id,
        CoffeeRoast: coffee.CoffeeRoast
      }
    });
  }
});

Template.modalEdit.events({
  'submit .modalOk'(event){
    //prevent the refresh page and put params in
    event.preventDefault();
    var form = Common.WebrewModal.GetForm(event);
    //update database
    let editBrew = {};
    editBrew.coffeecompany = form.company.value;
    editBrew.coffeename = form.title.value;
    editBrew.coffeeroast = form.roast.value;
    editBrew.imageURL = form.imageURL.value;
    editBrew.coffeedescription = form.description.value;
    editBrew._id = Template.instance().data.id;
    let coffee = new Coffee(editBrew);
    //Upload if imageURL has attribute disabled for file
    if ( document.getElementById("imageURL").hasAttribute("disabled") ){
      editBrew.imageURL = uploadFile(editBrew._id, "coffees.upload");
    }

    Meteor.call('coffees.edit', coffee.Get(), (err, res) => {
      if(!err){
        FlowRouter.go('/brew/' + editBrew.coffeename);
        Common.WebrewToast.Show(editBrew.coffeename + " updated!", "success")
        Common.WebrewModal.Hide();
      } else {
        Common.WebrewToast.Show(editBrew.coffeename + " already exists.", "error")
      }
    });
  }
});

Template.modalEdit.onRendered(() => {
  $("#roast").val(Template.instance().data.CoffeeRoast);
})