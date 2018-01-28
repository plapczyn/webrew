import './newbrew.html';
import './newbrew.css';
import { Coffees } from '../../api/collections/coffees.js';
import Common from '../common/scripts/common.js';
import "../../ui/common/templates/webrewInput.js";
import { Coffee } from '../../../lib/DatabaseModels.js';
import '../common/templates/imgupload.js'

Template.newbrew.onCreated( function (){
  let template = Template.instance();
});

Template.newbrew.events({
  'submit .newbrew'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    // Insert a new coffee into the collection
    let obj = {};
    obj.coffeeCompanyId = template.company.getKey();
    obj.coffeeCompanyValue = template.company.getValue();
    obj.coffeename = target.name.value.trim();
    obj.coffeeroast = target.roast.value.trim();
    obj.coffeedescription = target.description.value.trim();
    //Set imageURL as loader image during upload
    if ( document.getElementById("imageURL").hasAttribute("disabled") ){
      obj.imageURL = "/img/coffee.gif";
    } else {
      obj.imageURL = target.imageURL.value.trim();
    }
    
    Meteor.call('coffees.add', obj , (err, res) => {
      if(!err){
        Common.WebrewToast.Show("Mmm, It's a Good Brew!","success", obj.coffeename + "was added!" );
        
        //If Image Upload, load image with filename as res/CoffeeID
        if ( document.getElementById("imageURL").hasAttribute("disabled") ){
          uploadImgur(res, "coffees.uploadImgur");
        }
        FlowRouter.go('Main');
      }
      else {
        Common.WebrewToast.Show(obj.coffeename + ' already exists. click to check it out.', "error");
      }
    });
  },
  'click .newbrew' (event){
    $('[data-toggle="tooltip"]').tooltip();
  }
});

Template.newbrew.helpers({
  getColor(roastName){
    return Common.WebrewColorPallet.roastName.Color;
  },
  getWebrewInput(webrewInput){
    console.log(webrewInput);
  },
  setupInput1(test){
    let instance = Template.instance();
    let options = {
      elementId: "companyId",
      method: "roasters.dropdown",
      rowCount: 5,
      required: true,
      initialize: (input) => {
        instance.company = input;
      }
    }

    return options;
  }
});

Template.newbrew.onRendered(function() {
});

