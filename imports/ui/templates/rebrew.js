import './rebrew.html'
import { BrewFiles } from '../../api/collections/coffees.js';
import { Brewfile } from '../../../lib/DatabaseModels.js';
import { Rebrew } from '../../../lib/DatabaseModels.js';
import Common from '../common/scripts/common.js'

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
  isAdvanced(){
    return this.advanced;
  },  
});

Template.rebrew.events({
    'click .delRebrewModal'(event) {
      Common.WebrewModal.Show({
        template: "deleteRebrewModal",
        title: "Delete this rebrew?",
        okCallback: () => {
          let ID = this.id
          Meteor.call('rebrews.removeById', ID, (err, res) => {
            Common.WebrewToast.Show("reBrew was removed","success");
          });
        }
      });
    },
    'click .editRebrewModal'(event) {
      Common.WebrewModal.Show({
        template: "editRebrewModal",
        title: "Edit Brew",
        coffeeOk: true,
        data: {
          id: this.id,
          advanced: this.advanced,
          body: this.body,
          acidity: this.acidity,
          flavour: this.flavour,
          balance: this.balance,
          aroma: this.aroma,
          title: this.title,
          rebrew: this.rebrew,
          ratingNum: this.ratingNum,
          coffeeid: this.coffeeid
        }
      });
      return;
        document.getElementById("EditrebrewID" + this.id).value = this.id;
        document.getElementById("EditrebrewAdv" + this.id).value = this.advanced;
        document.getElementById("bEadrating1").innerText = this.aroma;
        document.getElementById("bEadrating2").innerText = this.body;
        document.getElementById("bEadrating3").innerText = this.acidity;
        document.getElementById("bEadrating4").innerText = this.flavour;
        document.getElementById("bEadrating5").innerText = this.balance;
    },
    'submit .EditsubmitRebrew'(event){
        event.preventDefault();
        let rebrew = {};
        rebrew._id = document.getElementById("EditrebrewID" + this.id).value;
        rebrew.Advanced = document.getElementById("EditrebrewAdv" + this.id).value;
        rebrew.Title = event.target.title.value;
        rebrew.Rebrew = event.target.rebrew.value;
        rebrew.CoffeeId = this.coffeeid;
        if (rebrew.Advanced == 'true' || rebrew.Advanced == true ){
          rebrew.Advanced = true;
          rebrew.Aroma = $('#Eadrating1').val();
          rebrew.Body = $('#Eadrating2').val();
          rebrew.Acidity = $('#Eadrating3').val();
          rebrew.Flavour = $('#Eadrating4').val();
          rebrew.Balance = $('#Eadrating5').val();
        }else{
          rebrew.Advanced = false;
          rebrew.Rating = event.target.rating.value;
        }

        Meteor.call('rebrews.updateRebrew',rebrew, (err, res) => {
            $("#EditreBrewingModal" + this.id).modal("hide");
        });
    },
    //Star Rating
    'click .rating'(event) {
        const value = $(event.target).val();
        $("#erating" + Template.instance().data.id).val(value);
    },
    //Range Value
    'change .slider'(event) {
      let slider = event.target.id;
      $("#b" + slider).text( $("#" + slider).val() );
    }    
});

Template.editRebrewModal.events({
'submit .modalOk'(event) {
  event.preventDefault();
  var data = Template.instance().data;
  rebrew = {};
  rebrew._id = data.id;
  rebrew.Advanced = data.advanced;
  var form = Common.WebrewModal.GetForm(event);
  rebrew.Title = form.title.value;
  rebrew.Rebrew = form.rebrew.value;
  rebrew.CoffeeId = this.coffeeid;
  if (rebrew.Advanced == 'true' || rebrew.Advanced == true ){
    rebrew.Advanced = true;
    rebrew.Aroma = $('#Eadrating1').val();
    rebrew.Body = $('#Eadrating2').val();
    rebrew.Acidity = $('#Eadrating3').val();
    rebrew.Flavour = $('#Eadrating4').val();
    rebrew.Balance = $('#Eadrating5').val();
  }else{
    rebrew.Advanced = false;
    rebrew.Rating = form.rating.value;
  }

  Meteor.call('rebrews.updateRebrew',rebrew, (err, res) => {
    if(!err){
      Common.WebrewToast.Show("Rebrew updated Successfully!", "success", rebrew.Title)
      Common.WebrewModal.Hide();
    }
  });
  
},
'click .rating'(event) {
  const value = $(event.target).val();
  $("#erating" + Template.instance().data.id).val(value);
},
});

Template.deleteRebrewModal.events({
  'submit .modalOk'(event) {

  }
});