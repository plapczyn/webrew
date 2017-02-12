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
    template.subscribe( 'brew',brewName, () => {
      setTimeout( () => {
      }, 300 );
    });

    template.subscribe('rebrews', brewName, () => {
        setTimeout( () => {
      }, 300 );
    })
  });

});

Template.brew.helpers({
  addingRebrew: false,
  brew () {
    return Coffees.find();
  },

  isOwner(){
    return this.owner === Meteor.userId();
  },

  InFavorites(){
    let username = Meteor.user().username;
    let brew = FlowRouter.getParam("brewId");
    let favorite =  Favorites.findOne({user: username, name: brew});

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
            Coffees.remove(document.getElementById("brewID").value);
            FlowRouter.go('Main');
            Toast.info(brew + " was removed");
        });
        $("#DeleteBrewModal").modal("hide");
  },

    'click .addToFavorites'(event){
    var userName = Meteor.user().username;
    var brew = FlowRouter.getParam('brewId')
    Favorites.insert({user: userName, name:brew });
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
    Toast.info(brew + " was added to your favorites");
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
    Rebrews.insert({
      user: user,
      brew: brew,
      rebrew: rebrew,
      rating: rating,
      title: title,
      reviewdate: reviewdate
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
