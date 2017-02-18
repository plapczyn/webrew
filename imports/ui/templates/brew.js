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
    let brew = FlowRouter.getParam("brewId");
    let favorite =  Favorites.findOne({name: brew});

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
    var brew = FlowRouter.getParam('brewId')
    var favorite = {user: userName, name: brew};

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
    var favoriteId = Favorites.findOne({user: user, name: brew})._id;
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
    //prevent the stupid refresh page and put params in
    event.preventDefault();

    //grab form data
    const target = event.target;
    const title = target.title.value;
    const rebrew = target.rebrew.value;
    const rating = target.rating.value;
    const user = Meteor.user().username;
    const reviewdate = Date.now();
    let brew = FlowRouter.getParam('brewId');



    //insert into database
    var rebrewToInsert = {
      user: user,
      brew: brew,
      rebrew: rebrew,
      rating: rating,
      title: title,
      reviewdate: reviewdate
    }
    Meteor.call('rebrews.add', rebrewToInsert, (err, res) => {
      if(!err){
        Toast.info('Your rebrew was added successfully');
      }
      else{
        Toast.info('Your rebrew was not submitted successfully');
      }
    });


    // Recalculate average
    let allreviews = Rebrews.find({brew:brew}).fetch();
    let ratings = _.pluck(allreviews, "rating");
    let sum = ratings.reduce(function(a, b){return parseFloat(a) + parseFloat(b);});
    let average = (sum / ratings.length).toFixed(1);
    Coffees.update(Coffees.findOne({name:brew})._id, {$set: {averageRating: average}});

      //resetform and refresh page
    $("#reBrewingModal").modal("hide");
    Template.instance().isReBrewing.set(false);
    let name = FlowRouter.getParam('brewId');
    FlowRouter.go('brew', {brewId: name});
    Toast.info("New reBrew added to " + brew);
  },
    //Goto Profile
  'click .goMe' (event){
      FlowRouter.go('mebrew', {userName: Meteor.user().username})
  },

  //Star Rating
  'click .rating'(event) {
    const value = $(event.target).val();
    $("#irating").val(value);
  }

});
