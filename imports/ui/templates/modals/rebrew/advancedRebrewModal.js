import './advancedRebrewModal.html';


Template.advancedRebrewModal.onCreated(() => {
  let template = Template.instance();
  template.isAdvanced = new ReactiveVar(false);
});

Template.advancedRebrewModal.helpers({
  isAdvanced(){
    var adv = Template.instance().isAdvanced.get();
    return adv;
  }});

  Template.advancedRebrewModal.events({
    'click .toggleAdvanced'(event){
      let isAdvanced = Template.instance().isAdvanced.get()
      console.log('asdasd');
      Template.instance().isAdvanced.set(!isAdvanced);
    },

    'submit .submitRebrew'(event){
      console.log(event);
      console.log(event.target.title.value);
      //prevent the refresh page and put params in

      let isAdvanced = Template.instance().isAdvanced.get();
      event.preventDefault();
      var advancedRebrew = {};

      if(isAdvanced){
        advancedRebrew = prepareAdvancedRebrew(event);
      }
      advancedRebrew.CoffeeName = FlowRouter.getParam('brewId');
      advancedRebrew.CoffeeId = this._id;
      advancedRebrew.Advanced = isAdvanced;

      const target = event.target;
      advancedRebrew.Title = target.title.value;
      advancedRebrew.Rebrew = target.rebrew.value;

      if(!isAdvanced){
        advancedRebrew.Rating = target.rating.value;
      }

      console.log(advancedRebrew);

      Toast.options = {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-left',
        showEasing: 'swing',
        hideEasing: 'linear',
        showMethod: 'fadeIn',
        hideMethod: 'fadeOut',
        timeOut: 1499,
        color: 'red'
      };
      //insert into database
      Meteor.call('rebrews.add', advancedRebrew, (err, res) => {
        if(!err){
          Toast.info("New reBrew added to " + advancedRebrew.CoffeeName);
        }
        else{
          Toast.info('Your rebrew was not submitted successfully');
        }
      });

      //resetform and refresh page
      $("#reBrewingModal").modal("hide");
      let name = FlowRouter.getParam('brewId');
      FlowRouter.go('brew', {brewId: name});
    },
  });

  function prepareAdvancedRebrew(test) {
    let target = test.target;
    return unstableBrew = {
      Aroma: target.adrating1.value,
      Body: target.adrating2.value,
      Acidity: target.adrating3.value,
      Flavour: target.adrating4.value,
      Balance: target.adrating5.value
    };
  }
