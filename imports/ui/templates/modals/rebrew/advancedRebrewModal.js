import './advancedRebrewModal.html';
import Common from '../../../common/scripts/common.js';

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
      Template.instance().isAdvanced.set(!isAdvanced);
    },

    'submit .modalOk'(event){
      event.preventDefault();
      
      if(!Common.WebrewModal.IsFormValid(event)){
        return;
      }
      
      let isAdvanced = Template.instance().isAdvanced.get();
      var advancedRebrew = {};

      if(isAdvanced){
        advancedRebrew = prepareAdvancedRebrew(event);
      }
      advancedRebrew.CoffeeName = FlowRouter.getParam('brewId');
      advancedRebrew.CoffeeId = this.coffeeId;
      advancedRebrew.Advanced = isAdvanced;

      let inputs = Common.WebrewModal.GetForm(event);

      advancedRebrew.Title = inputs.title.value;
      advancedRebrew.Rebrew = inputs.rebrew.value;

      if(!isAdvanced){
        advancedRebrew.Rating = inputs.rating.value;
      }
      //insert into database
      Meteor.call('rebrews.add', advancedRebrew, (err, res) => {
        if(!err){
          Common.WebrewToast.Show("Added to " + advancedRebrew.CoffeeName, "success", "New reBrew!");
          Common.WebrewModal.Hide();
        }
        else
        {
          Common.WebrewToast.Show('Your rebrew was not submitted successfully', "error", "Oops!");
        }
      });

      //resetform and refresh page
      let name = FlowRouter.getParam('brewId');
      FlowRouter.go('brew', {brewId: name});
    },
    //Star Rating
    'click .rating'(event) {
        const value = $(event.target).val();
        $("#irating").val(value);
    },    
    //Range Value
    'change .slider'(event) {
      let slider = event.target.id;
      $("#b" + slider).text( $("#" + slider).val() );
    }   
  });

  function prepareAdvancedRebrew(event) {
    let target = Common.WebrewModal.GetForm(event)
    return unstableBrew = {
      Aroma: target.adrating1.value,
      Body: target.adrating2.value,
      Acidity: target.adrating3.value,
      Flavour: target.adrating4.value,
      Balance: target.adrating5.value
    };
  }
