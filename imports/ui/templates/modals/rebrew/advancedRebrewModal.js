import './advancedRebrewModal.html';


Template.advancedRebrewModal.onCreated(() => {
  let template = Template.instance();
    template.isAdvanced = new ReactiveVar(false);
})

Template.advancedRebrewModal.helpers({
  isAdvanced(){
    var adv = Template.instance().isAdvanced.get();
    return adv;
  }});

Template.advancedRebrewModal.events({
    'click .toggleAdvanced'(event){
      console.log('asdasd');
      Template.instance().isAdvanced.set(!Template.instance().isAdvanced.get());
    },

    'submit .submitRebrew'(event){
    //prevent the refresh page and put params in
    event.preventDefault();

    let advancedRebrew = prepareAdvancedRebrew();
    advancedRebrew.CoffeeName = FlowRouter.getParam('brewId');
    advancedRebrew.CoffeeId = this._id;

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
    Meteor.call('rebrews.add', rebrewToInsert.Get(), (err, res) => {
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
});





function prepareAdvancedRebrew(event) {
  console.log(event);
  return;
  let target = event.target;
  return unstableBrew = {
    aroma: target.adrating1,
    body: target.adrating2,
    acidity: target.adrating3,
    flavour: target.adrating4,
    balance: target.adrating5
  };
}
