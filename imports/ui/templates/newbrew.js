import './newbrew.html';
import './newbrew.css';
import { Coffees } from '../../api/collections/coffees.js';
import Common from '../common/scripts/common.js';
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
    obj.coffeecompany = target.company.value.trim();
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
          //uploadFile(res, "coffees.upload");
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
  }
});

Template.newbrew.onRendered(function() {
  console.log($("#coffeeCompany"));
  let gg = new Common.WebrewInput({renderOnId: "coffeeCompany"});
});