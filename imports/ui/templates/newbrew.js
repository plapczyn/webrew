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
    const company = target.company.value;
    const name = target.name.value;
    const roast = target.roast.value;
    const description = target.description.value;
    let imageURL = target.imageURL.value;
    //Set imageURL as nothing if file will be uploaded
    if ( document.getElementById("imageURL").hasAttribute("disabled") ){
      imageURL = "";
    }

    // Insert a new coffee into the collection
    let obj = {
      coffeecompany: company.trim(),
      coffeename: name.trim(),
      coffeeroast: roast.trim(),
      coffeedescription: description.trim(),
      imageURL: imageURL.trim(),
    };

    Meteor.call('coffees.add', obj , (err, res) => {
      if(!err){
        Common.WebrewToast.Show("Mmm, It's a Good Brew!","success", obj.coffeename + "was added!" );
        
        //If Image Upload, load image with filename as res/CoffeeID
        if ( document.getElementById("imageURL").hasAttribute("disabled") ){
          uploadFile(res, "coffees.upload");
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