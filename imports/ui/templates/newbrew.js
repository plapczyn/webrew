import './newbrew.html';
import './newbrew.css';
import { Coffees } from '../../api/collections/coffees.js';
import Common from '../common/scripts/common.js';
import { Coffee } from '../../../lib/DatabaseModels.js';

Template.newbrew.onCreated( function (){
  let template = Template.instance();
  template.isFileUpload = new ReactiveVar(false);
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
    if (template.isFileUpload.get() == true ){
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
        if (template.isFileUpload.get() == true ){
          console.log("startUploadFile");
          uploadFile(res);
          console.log("endUploadFile");
        }
        console.log("FlowRouterMain");
        FlowRouter.go('Main');
      }
      else {
        Common.WebrewToast.Show(obj.coffeename + ' already exists. click to check it out.', "error");
      }
    });
  },
  'click .newbrew' (event){
    $('[data-toggle="tooltip"]').tooltip();
  },
  'change #imageFile' (event, template){
    if(!event.target.files || !window.FileReader) return;
    template.isFileUpload.set( false ); 
    let imgDiv = document.getElementById("imgDiv");
    imgDiv.innerHTML = "";
    let file = event.target.files[0];
    //Is there a file
    if (!file) { 
      document.getElementsByName("imageURL")[0].value = "";  
      return; 
    }
    //Check filetype
    if (!(file.type.match('image.*'))){
      Common.WebrewToast.Show(file.name + " is not an image, please select an image.", "error");
      return;
    }
    //Check filesize
    if (file.size > 1024*1024*2) {
      Common.WebrewToast.Show(file.name + " is too large, please select an image smaller than 2MB", "error")
      return;
    }
    
    let reader = new FileReader();
    reader.onload = function (event) {
      imgDiv.innerHTML = "<img src=\"" + event.target.result + "\">";
      template.isFileUpload.set( true ); 
      document.getElementsByName("imageURL")[0].value = file.name;          
    }
    reader.readAsDataURL(file);
  }
});

Template.newbrew.helpers({
  getColor(roastName){
    return Common.WebrewColorPallet.roastName.Color;
  }
});


Template.newbrew.onRendered(function() {
  $(()=>{
    new Common.WebrewInput({renderOnId: "coffeeCompany"});
  });
});

uploadFile = function (id) {
  var file = document.getElementById("imageFile").files[0];
  if (file) {
    //Check filetype
    if (!(file.type.match('image.*'))){
      Common.WebrewToast.Show(file.name + " is not an image, please select an image.", "error")
      return;
    }
    //Check filesize
    if (file.size > 1024*1024*2) {
      Common.WebrewToast.Show(file.name + " is too large, please select an image smaller than 2MB", "error")
      return;
    }
    
    var reader = new FileReader();
    reader.onload = function(fileLoadEvent) {
    //call created upload method and pass file name, and file-reader info
    console.log("startUploadFileMeteorCall");
    Meteor.call('image.upload', id, file.name, reader.result, function(err, res) {
          if(!err){
            Common.WebrewToast.Show(file.name + " uploaded successfully", "success")
            console.log("endUploadFileMeteorCall");
          }
          else{
            Common.WebrewToast.Show(file.name + " was not uploaded successfully", "error")
          }
      });
    };
    reader.readAsBinaryString(file);
  }
}
