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
    obj.CoffeeBrandId = template.brand.getKey();
    obj.CoffeeBrandValue = template.brand.getValue();
    obj.CoffeeName = target.name.value.trim();
    obj.CoffeeRoast = target.roast.value.trim();
    obj.CoffeeDescription = target.description.value.trim();
    //Set imageURL as loader image during upload
    if ( document.getElementById("imageURL").hasAttribute("disabled") ){
      obj.ImageUrl = "/img/coffee.gif";
    } else {
      obj.ImageUrl = target.imageURL.value.trim();
    }
    
    Meteor.call('coffees.add', obj , (err, res) => {
      if(!err){
        Common.WebrewToast.Show("Mmm, It's a Good Brew!","success", obj.CoffeeName + "was added!" );
        
        //If Image Upload, load image with filename as res/CoffeeID
        if ( document.getElementById("imageURL").hasAttribute("disabled") ){
          uploadImgur(res, "coffees.uploadImgur");
        }
        FlowRouter.go('Main');
      }
      else {
        Common.WebrewToast.Show(obj.CoffeeName + ' already exists.', "error");
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
    console.log("WE DID IT");
  },
  setupInput1(){
    let instance = Template.instance();
    let options = {
      elementId: "brandId",
      method: "brands.dropdown",
      rowCount: 5,
      // mode: "checkbox",
      required: true,
      initialize: (input) => {
        instance.brand = input;
      }
    }

    return options;
  },
  setupInput2(){
    let instance = Template.instance();
    let options = {
      elementId: "brandId2",
      method: "brands.dropdown",
      rowCount: 5,
      mode: "checkbox",
      required: true,
      initialize: (input) => {
        instance.brand2 = input;
      }
    }

    return options;
  }
});

Template.newbrew.onRendered(function() {
});

