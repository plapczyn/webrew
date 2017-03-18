import './brew.html';
import './brew.css';
import Chart from 'chart.js';
import { Coffees } from '../../api/collections/coffees.js';
import { Favorites } from '../../api/collections/coffees.js';
import { Rebrews } from '../../api/collections/coffees.js';
import { Favorite } from '../../../lib/DatabaseModels.js';
import { AdvancedRebrew } from '../../../lib/DatabaseModels.js';
import { Rebrew } from '../../../lib/DatabaseModels.js';
import { Coffee } from '../../../lib/DatabaseModels.js';

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
      return this.CoffeeOwner === Meteor.userId();
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
  },
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
    Meteor.call('favorites.remove', brewid, user,  (err, res) => {
      if(!err){
        Toast.info(brew + " was removed from your favorites");
      }
      else{

        Toast.error(brew + " was not removed from your favorites and error has occured");
      }
    });


  },
  'click .addRebrew'(event){
    var instance = Template.instance();
    instance.isReBrewing.set(!instance.isReBrewing.get());
  },
  'submit .submitRebrew'(event){
    //prevent the refresh page and put params in
    event.preventDefault();

      //grab form data


    /*
    this._id = _id
    this.CoffeeId = coffeeId;
    this.CoffeeName = coffeeName;
    this.Rebrew = rebrew;
    this.Rating = rating;
    this.Title = title;
    this.ReviewDate = reviewDate;
    this.Owner = owner;
    this.User = user;
    */
    const target = event.target;
    rebrewToInsert = new Rebrew({
      Title: target.title.value,
      Rebrew: target.rebrew.value,
      Rating: target.rating.value,
      Username: Meteor.user().username,
      ReviewDate: Date.now(),
      CoffeeName: FlowRouter.getParam('brewId'),
      CoffeeId: this._id
    })
    // rebrewToInsert.title = target.title.value;
    // rebrewToInsert.rebrew = target.rebrew.value;
    // rebrewToInsert.rating = target.rating.value;
    // rebrewToInsert.user = Meteor.user().username;
    // rebrewToInsert.reviewdate = Date.now();
    // rebrewToInsert.brew = FlowRouter.getParam('brewId');
    // rebrewToInsert.brewid = this._id;


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
        Toast.info("New reBrew added to " + rebrewToInsert.CoffeeName);
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


//Populate Chart - ID = myChart onRendered
Template.canvas.onRendered (function() {
   let data2 = {
        labels: ["Aroma", "Body", "Acidity", "Flavour", "Balance"],
        datasets: [
        {
        label: "Average Review",
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        data: [6, 5, 10, 8, 5]
      }
    ]};

  let data = {
    labels: ["Aftertaste", "Complexity", "Sweetness", "Bitterness", "Drinkability"],
    datasets: [
      {
        label: "Average Review",
        backgroundColor: "rgba(179,181,198,0.2)",
        borderColor: "rgba(179,181,198,1)",
        pointBackgroundColor: "rgba(179,181,198,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        data: [6, 5, 9, 8, 5]
      },
      {
        label: "This Brew",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        pointBackgroundColor: "rgba(255,99,132,1)",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(255,99,132,1)",
        data: [2, 4, 4, 1, 9]
      }
    ]
  };
  let myRadarChart = new Chart(document.getElementById('myChart'), {
    type: 'radar',
    data: data2,
    options: {
        title: {
            display: true,
            text: 'Brew Profile'
        },
        backgroundColor: "rgba(0,0,0,0)",
        fontSize: 16,
    }
  });
});
