import './brew.html';
import './brew.css';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
import { Rebrews } from '../../api/collections/coffees.js';

Template.brew.onCreated(function (){
  var template = Template.instance();
  template.isReBrewing = new ReactiveVar(false);
  var brewName = FlowRouter.getParam('brewId');

  template.autorun( () => {
    let user = "";

    if(Meteor.user()){
      user = Meteor.user().username;
    }

    // template.subscribe( 'brew',brewName, () => {
    //   setTimeout( () => {
    //   }, 300 );
    // });
    //
    // template.subscribe('rebrews', brewName, () => {
    //   setTimeout( () => {
    //   }, 300 );
    // })
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
    return this.owner === Meteor.userId();
  },

  InFavorites(){
    let favorite =  Favorites.findOne({brewid: this._id});

    if(!favorite){
      return true;
    }
    return false;
  },

  reBrew(){
    return Rebrews.find();
  },

  rebrewing(){
    return Template.instance().isReBrewing.get();
  }
});

Template.brew.events({
    'click .delModal'(event) {
        document.getElementById("brewID").value = this._id;
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
        $("#DeleteBrewModal").on("hidden.bs.modal", function (){
            //Remove coffee from the collection
            let id = document.getElementById("brewID").value
            Meteor.call('coffees.removeById', id, (err, res) => {
              if(err){
                Toast.info(brew + " was not removed successfully");
              }
              else{
                Toast.info(brew + " was removed");
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
    var favorite = {user: userName, brewid: brewid};

    Meteor.call('favorites.add', favorite, (err, res) => {
      if(!err){
        Toast.info(brew + " was added to your favorites");
      }
      else{

        Toast.info(brew + " was not added to your favorites. An error occured");
      }
  });
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
  },

  'click .removeFromFavorites'(event){
    event.preventDefault();
    var user = Meteor.user().username;
    var brew = FlowRouter.getParam('brewId');
    var brewid = this._id;
    var favoriteId = Favorites.findOne({user: user, brewid: brewid})._id;
    Favorites.remove({_id: favoriteId});
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
    Toast.info(brew + " was removed from your favorites");
  },
  'click .addRebrew'(event){
    var instance = Template.instance();
    instance.isReBrewing.set(!instance.isReBrewing.get());
  },
  'submit .submitRebrew'(event){
    //prevent the refresh page and put params in
    event.preventDefault();

      //grab form data 
    let rebrewToInsert = {}; 
    const target = event.target;
    rebrewToInsert.title = target.title.value;
    rebrewToInsert.rebrew = target.rebrew.value;
    rebrewToInsert.rating = target.rating.value;
    rebrewToInsert.user = Meteor.user().username;
    rebrewToInsert.reviewdate = Date.now();
    rebrewToInsert.brew = FlowRouter.getParam('brewId');
    rebrewToInsert.brewid = this._id;


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
    //insert into database
    Meteor.call('rebrews.add', rebrewToInsert, (err, res) => {
      if(!err){
        Toast.info("New reBrew added to " + brew);
      }
      else{
        Toast.info('Your rebrew was not submitted successfully');
      }
    });

    //resetform and refresh page
    $("#reBrewingModal").modal("hide");
    Template.instance().isReBrewing.set(false);
    let name = FlowRouter.getParam('brewId');
    FlowRouter.go('brew', {brewId: name});
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
      editBrew.name = target.title.value;
      editBrew.roast = target.roast.value;
      editBrew.imageURL = target.imageURL.value;
      editBrew.description = target.description.value;
      editBrew.id = document.getElementById("editbrewID").value;

      $("#EditBrewModal").on("hidden.bs.modal", function (){
          Meteor.call('coffees.edit', editBrew, (err, res) => {
              if(!err){
                  FlowRouter.go('/brew/' + editBrew.name);
              } else {
                  Toast.options = {
                      closeButton: true,
                      progressBar: true,
                      positionClass: 'toast-bottom-center',
                      showEasing: 'swing',
                      hideEasing: 'linear',
                      showMethod: 'fadeIn',
                      hideMethod: 'fadeOut',
                      timeOut: 1500,
                      color: 'red'
                  };
                  Toast.error(editBrew.name + " already exists.");
              }
          });
      });
      $("#EditBrewModal").modal("hide");
  },

  //Goto Profile
  'click .goMe' (event){
      FlowRouter.go('mebrew', {userName: Meteor.user().username});
  },

  //Star Rating
  'click .rating'(event) {
    const value = $(event.target).val();
    $("#irating").val(value);
  }

});
